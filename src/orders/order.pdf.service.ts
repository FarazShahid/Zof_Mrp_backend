// src/orders/order-pdf.service.ts
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import * as archiver from 'archiver';
import * as Handlebars from 'handlebars';
import * as stream from 'stream';
import { promisify } from 'util';
import { Order } from './entities/orders.entity';
import puppeteer from 'puppeteer';
import { PdfType } from './dto/order.pdf.dto';

const pipeline = promisify(stream.pipeline);

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
    // 1) Load order + relations we need
    const order = await this.orderRepo.findOne({
      where: { Id: orderId },
      relations: [
        'orderItems',
        'orderItems.printingOptions',
        'orderItems.printingOptions.printingOption',
        'orderItems.orderItemDetails',
        'orderItems.orderItemDetails.colorOption',
      ],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 2) Compile HTML template
    const template = await this.loadTemplate();

    // 3) Launch Puppeteer once
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // 4) Create a temp folder for PDFs
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'order-pdfs-'));

    try {
      // 5) Generate one PDF per order item
      const isSpec = pdfType === PdfType.SPECIFICATION;

      await Promise.all(
        (order.orderItems ?? []).map(async (item, i) => {
          // shape the template context
          const ctx = {
            isSpec,
            generatedAt: new Date().toISOString(),
            order: {
              id: order.Id,
              number: order.OrderNumber,
              name: order.OrderName ?? '',
              priority: order.OrderPriority,
              externalId: order.ExternalOrderId,
              shipmentStatus: order.OrderShipmentStatus, // enum string
            },
            item: {
              index: i + 1,
              id: item.Id,
              description: item.Description ?? '',
              productId: item.ProductId,
              shipmentStatus: item.itemShipmentStatus,
            },
            details: (item.orderItemDetails ?? []).map(d => ({
              id: d.Id,
              quantity: d.Quantity,
              sizeOption: d.SizeOption,
              measurementId: d.MeasurementId,
              color: d.colorOption?.Name ?? d.ColorOptionId, // adjust field name if different
              priority: d.Priority,
            })),
            printingOptions: (item.printingOptions ?? []).map(po => ({
              id: po.Id,
              printingOptionId: po.PrintingOptionId,
              name: po.printingOption?.Type ?? po.PrintingOptionId, // adjust field
              description: po.Description ?? '',
            })),
          };

          const html = template(ctx);

          await page.setContent(html, { waitUntil: ['domcontentloaded'] });
          // You can tweak PDF options here
          const pdfBuffer = await page.pdf({
            printBackground: true,
            format: 'A4',
            margin: { top: '12mm', right: '12mm', bottom: '14mm', left: '12mm' },
          });

          const safeOrderNumber = (order.OrderNumber || `order-${order.Id}`).toString().replace(/[^\w\-]+/g, '_');
          const filename = isSpec
            ? `${safeOrderNumber}-item-${item.Id}-spec.pdf`
            : `${safeOrderNumber}-item-${item.Id}-summary.pdf`;

          await fs.writeFile(path.join(tempDir, filename), pdfBuffer);
        }),
      );

      // 6) Zip them
      const zipDisplayName = isSpec ? 'order specification.zip' : 'order summary.zip';
      const zipPath = path.join(tempDir, zipDisplayName);

      await new Promise<void>((resolve, reject) => {
        const output = require('fs').createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        output.on('close', () => resolve());
        archive.on('error', reject);
        archive.pipe(output);
        archive.directory(tempDir, false, (entry) => {
          // only include PDFs, skip the zip itself
          if (!entry.name.endsWith('.pdf')) return null as any;
          return entry;
        });
        archive.finalize();
      });

      // 7) Return zip as a stream (and keep temp files until response is done)
      const zipBuffer = await fs.readFile(zipPath);
      const file = new StreamableFile(zipBuffer, {
        type: 'application/zip',
        disposition: `attachment; filename="${zipDisplayName}"`,
      });

      return { filename: zipDisplayName, file };
    } finally {
      await browser.close();
      // cleanup temp dir async (best to schedule)
      setTimeout(() => fs.rm(tempDir, { recursive: true, force: true }).catch(() => { }), 5000);
    }
  }
}
