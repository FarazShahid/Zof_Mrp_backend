import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async getRootFolders(): Promise<any[]> {
    const rows = await this.dataSource.query(`
      SELECT
        c.Id              AS clientId,
        c.Name            AS clientName,
        COUNT(m.id)       AS documentsCount,
        MAX(m.uploaded_on) AS lastDocumentDate
      FROM client c
      INNER JOIN orders o       ON o.ClientId = c.Id
      INNER JOIN media_links ml ON ml.reference_type = 'order' AND ml.reference_id = o.Id
      INNER JOIN media m        ON m.id = ml.media_id AND m.deleted_at IS NULL
      GROUP BY c.Id, c.Name
      ORDER BY c.Name ASC
    `);

    return rows.map((row) => ({
      clientId: row.clientId,
      clientName: row.clientName,
      documentsCount: Number(row.documentsCount),
      lastDocumentDate: row.lastDocumentDate ?? null,
    }));
  }

  async getClientFolder(clientId: number): Promise<any> {
    const clients = await this.dataSource.query(
      `SELECT Id, Name FROM client WHERE Id = ? LIMIT 1`,
      [clientId],
    );

    if (!clients.length) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const client = clients[0];

    const rows = await this.dataSource.query(
      `SELECT
        o.Id            AS orderId,
        o.OrderNumber,
        o.OrderName,
        COUNT(m.id)     AS documentsCount
      FROM orders o
      INNER JOIN media_links ml ON ml.reference_type = 'order' AND ml.reference_id = o.Id
      INNER JOIN media m        ON m.id = ml.media_id AND m.deleted_at IS NULL
      WHERE o.ClientId = ?
      GROUP BY o.Id, o.OrderNumber, o.OrderName
      ORDER BY o.Id ASC`,
      [clientId],
    );

    const folders = rows.map((row) => ({
      type: 'order',
      id: row.orderId,
      name: row.OrderNumber || `Order-${row.orderId}`,
      documentsCount: Number(row.documentsCount),
    }));

    return {
      clientId: client.Id,
      clientName: client.Name,
      folders,
    };
  }

  async getOrderFolder(orderId: number): Promise<any> {
    const orders = await this.dataSource.query(
      `SELECT Id, OrderNumber FROM orders WHERE Id = ? LIMIT 1`,
      [orderId],
    );

    if (!orders.length) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const order = orders[0];

    const rows = await this.dataSource.query(
      `SELECT
        m.id,
        m.file_name   AS fileName,
        m.file_type   AS fileType,
        m.file_url,
        m.uploaded_by AS uploadedBy,
        m.uploaded_on AS uploadedAt
      FROM media m
      INNER JOIN media_links ml ON ml.media_id = m.id
        AND ml.reference_type = 'order'
        AND ml.reference_id = ?
      WHERE m.deleted_at IS NULL
      ORDER BY m.uploaded_on DESC`,
      [orderId],
    );

    const documents = rows.map((row) => ({
      id: row.id,
      fileName: row.fileName,
      fileType: row.fileType,
      fileSize: null,
      uploadedAt: row.uploadedAt ?? null,
      uploadedBy: row.uploadedBy ?? null,
      fileUrl: this.buildFileUrl(row.file_url),
    }));

    return {
      orderId: order.Id,
      orderNumber: order.OrderNumber || `Order-${order.Id}`,
      documents,
    };
  }

  private buildFileUrl(blobName: string | null): string | null {
    if (!blobName) return null;
    const base = this.configService.get<string>('MEDIA_VIEW_URL') || '';
    if (!base) return null;
    const trimmed = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${trimmed}/${encodeURIComponent(blobName)}`;
  }
}
