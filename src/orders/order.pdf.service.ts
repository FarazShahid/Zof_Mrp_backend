// src/orders/order-pdf.service.ts
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';
import { Order } from './entities/orders.entity';
import puppeteer from 'puppeteer';
import { PdfType } from './dto/order.pdf.dto';
import { buildMeasurements, formatDate, mapStatusToChip, resolveSizeName } from 'pdf-templates/utils/utils';

@Injectable()
export class OrderPdfService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) { }

  private templateCache: Handlebars.TemplateDelegate | null = null;

  private async loadTemplate(): Promise<Handlebars.TemplateDelegate> {
    if (this.templateCache) return this.templateCache;
    const templatePath = path.join(process.cwd(), 'pdf-templates', 'order-pdf.html');
    const html = await fs.readFile(templatePath, 'utf-8');
    this.templateCache = Handlebars.compile(html, { noEscape: true });
    return this.templateCache;
  }

  async generateOrderItemsZip(orderId: number, pdfType: PdfType): Promise<{ filename: string; file: StreamableFile }> {
    // 1) Load order + needed graph (joins without FK; select whole rows via alias.*)
    const order = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.event', 'event')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.orderItems', 'item')
      .leftJoinAndSelect('item.product', 'product')

      // FabricType (no FK) -> product.fabricType
      .leftJoinAndMapOne('product.fabricType', 'fabrictype', 'fabricType', 'fabricType.Id = product.FabricTypeId')
      .addSelect('fabricType.*')

      // Details
      .leftJoinAndSelect('item.orderItemDetails', 'detail')

      // SizeOption (no FK) -> detail.sizeOpt
      .leftJoinAndMapOne('detail.sizeOpt', 'sizeoptions', 'sizeOpt', 'sizeOpt.Id = detail.SizeOption')
      .addSelect('sizeOpt.*')

      // ColorOption (keep single join)
      .leftJoinAndSelect('detail.colorOption', 'colorOption')

      // SizeMeasurements (no FK) -> detail.measurement
      .leftJoinAndMapOne('detail.measurement', 'sizemeasurements', 'sm', 'sm.Id = detail.MeasurementId')
      .addSelect('sm.*')

      // Printing options
      .leftJoinAndSelect('item.printingOptions', 'printingOptionLink')
      .leftJoinAndSelect('printingOptionLink.printingOption', 'printingOption')

      .where('order.Id = :id', { id: orderId })
      .getOne();

    if (!order) throw new NotFoundException('Order not found');

    // 2) Template / constants
    const template = await this.loadTemplate();
    const isSpec = pdfType === PdfType.SPECIFICATION;
    const zipDisplayName = isSpec ? 'order specification.zip' : 'order summary.zip';

    // 3) Launch ONE browser
    const browser = await puppeteer.launch({
      headless: true,                       // boolean | "shell"
      protocolTimeout: 120_000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    // 4) Temp path + zip stream (no per-PDF disk I/O)
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'order-pdfs-'));
    const zipPath = path.join(tempDir, zipDisplayName);
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    const finalizeZip = new Promise<void>((resolve, reject) => {
      output.on('finish', resolve);
      output.on('close', resolve);
      output.on('error', reject);
      archive.on('error', reject);
      archive.on('warning', (err: any) => { if (err?.code !== 'ENOENT') reject(err); });
      archive.pipe(output);
    });

    // 5) Base header VM (stable across items)
    const baseHeaderVm = {
      isSpec,
      generatedAt: new Date().toISOString(),
      statusClass: mapStatusToChip(order?.status?.StatusName),
      deadlineFormatted: formatDate(order?.Deadline),
      orderHeader: {
        OrderNumber: order?.OrderNumber ?? '',
        StatusName: order?.status?.StatusName ?? '',
        ClientName: order?.client?.Name ?? '',
        EventName: order?.event?.EventName ?? '',
      },
    };

    // 6) Page pool with bounded concurrency
    const itemCount = order.orderItems?.length ?? 0;
    const maxCpu = Math.max(2, (os.cpus()?.length ?? 4));
    const CONCURRENCY = Math.min(6, Math.max(1, Math.min(maxCpu, Math.ceil(itemCount / 5))));
    const queue = [...(order.orderItems ?? [])];

    // Pre-create pages for reuse + block external network
    const pagePool: any[] = [];
    for (let i = 0; i < Math.max(1, CONCURRENCY); i++) {
      const p = await browser.newPage();
      p.setDefaultTimeout(60_000);
      p.setDefaultNavigationTimeout(60_000);
      await p.setJavaScriptEnabled(false); // static HTML; faster

      await p.setRequestInterception(true);
      p.on('request', req => {
        const url = req.url();
        // Allow data:, file:, about:, chrome:; block outbound http(s)
        if (url.startsWith('http')) return req.abort();
        return req.continue();
      });

      pagePool.push(p);
    }

    const renderOne = async (page: any, item: any) => {
      try {
        const ft: any = item?.product?.fabricType;
        console.log("item.orderItemDetails", item?.orderItemDetails)
        const vm = {
          isSpec: baseHeaderVm.isSpec,
          generatedAt: baseHeaderVm.generatedAt,
          statusClass: baseHeaderVm.statusClass,
          deadlineFormatted: baseHeaderVm.deadlineFormatted,
          order: {
            OrderNumber: baseHeaderVm.orderHeader.OrderNumber,
            StatusName: baseHeaderVm.orderHeader.StatusName,
            ClientName: baseHeaderVm.orderHeader.ClientName,
            EventName: baseHeaderVm.orderHeader.EventName,
            items: [
              {
                ProductName: item?.product?.Name ?? '',
                ProductCategoryName: item.product?.ProductCategory?.type ?? '',
                ProductFabricName: ft?.Name ?? '',
                ProductFabricGSM: ft?.GSM ?? '',
                chartSrc: undefined,
                orderItemDetails: (item?.orderItemDetails ?? []).map((detail: any) => ({
                  Quantity: detail.Quantity,
                  SizeOptionName: detail.sizeOpt?. OptionSizeOptions ?? "Unknown Size",
                  Priority: detail.Priority,
                  measurements: detail.measurement
                    ? buildMeasurements(detail.measurement)
                    : { top: [], bottom: [], logoTop: [], logoBottom: [], hat: [] },
                })),
                printingOptions: (item.printingOptions ?? []).map((po: any) => ({
                  PrintingOptionName: po.printingOption?.Type ?? `#${po.PrintingOptionId}`,
                })),
              },
            ],
          },
        };

        const html = template(vm);
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        await page.emulateMediaType('print');

        const pdfData = await page.pdf({
          printBackground: true,
          format: 'A4',
          margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
          scale: 1.125
        });

        const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);
        if (!pdfBuffer || pdfBuffer.length === 0) {
          throw new Error(`Empty PDF buffer for item ${item?.Id ?? 'unknown'}`);
        }

        const safeOrderNumber = (order.OrderNumber || `order-${order.Id}`).toString().replace(/[^\w\-]+/g, '_');
        const filename = isSpec
          ? `${safeOrderNumber}-item-${item.Id}-spec.pdf`
          : `${safeOrderNumber}-item-${item.Id}-summary.pdf`;

        archive.append(pdfBuffer, { name: filename });
        await new Promise(res => setImmediate(res));
      } catch (err) {
        console.error(`PDF render failed for item ${item?.Id}:`, err);
      }
    };
    // 8) Workers
    const runWorker = async () => {
      const page = pagePool.pop()!;
      try {
        while (queue.length) {
          const item = queue.shift();
          if (!item) break;
          await renderOne(page, item);
        }
      } finally {
        pagePool.push(page);
      }
    };

    try {
      await Promise.all(Array.from({ length: Math.max(1, CONCURRENCY) }, () => runWorker()));

      await archive.finalize();
      await finalizeZip;

      // 9) Stream the ZIP back (avoid RAM spike)
      const zipRead = createReadStream(zipPath);
      const file = new StreamableFile(zipRead, {
        type: 'application/zip',
        disposition: `attachment; filename="${zipDisplayName}"`,
      });

      return { filename: zipDisplayName, file };
    } finally {
      // Cleanup
      await Promise.all(pagePool.map(p => p.close().catch(() => { })));
      await browser.close().catch(() => { });
      setTimeout(() => fs.rm(tempDir, { recursive: true, force: true }).catch(() => { }), 2000);
    }
  }
}
