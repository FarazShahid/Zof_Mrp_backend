import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DocumentFolderQueryDto } from './dto/document-folder-query.dto';

// Whitelisted sort column maps — prevents SQL injection from sortBy param
const ROOT_SORT_COLUMNS: Record<string, string> = {
  clientName:       'c.Name',
  documentsCount:   'documentsCount',
  lastDocumentDate: 'lastDocumentDate',
};

const CLIENT_SORT_COLUMNS: Record<string, string> = {
  orderId:        'o.Id',
  orderNumber:    'o.OrderNumber',
  documentsCount: 'documentsCount',
};

const ORDER_SORT_COLUMNS: Record<string, string> = {
  fileName:   'm.file_name',
  fileType:   'm.file_type',
  uploadedAt: 'm.uploaded_on',
};

@Injectable()
export class DocumentsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async getRootFolders(query: DocumentFolderQueryDto): Promise<any> {
    const page      = query.page      ?? 1;
    const limit     = query.limit     ?? 10;
    const search    = query.search?.trim() || null;
    const sortOrder = query.sortOrder ?? 'ASC';
    const sortCol   = ROOT_SORT_COLUMNS[query.sortBy] ?? 'c.Name';
    const offset    = (page - 1) * limit;

    const whereClause = search ? `WHERE c.Name LIKE ?` : '';
    const searchParam = search ? [`%${search}%`] : [];

    const [countResult] = await this.dataSource.query(
      `SELECT COUNT(*) AS total FROM client c ${whereClause}`,
      searchParam,
    );
    const total      = Number(countResult.total);
    const totalPages = Math.ceil(total / limit);

    const rows = await this.dataSource.query(
      `SELECT
        c.Id               AS clientId,
        c.Name             AS clientName,
        COUNT(m.id)        AS documentsCount,
        MAX(m.uploaded_on) AS lastDocumentDate
      FROM client c
      LEFT JOIN orders o       ON o.ClientId = c.Id
      LEFT JOIN media_links ml ON ml.reference_type = 'order' AND ml.reference_id = o.Id
      LEFT JOIN media m        ON m.id = ml.media_id AND m.deleted_at IS NULL
      ${whereClause}
      GROUP BY c.Id, c.Name
      ORDER BY ${sortCol} ${sortOrder}
      LIMIT ? OFFSET ?`,
      [...searchParam, limit, offset],
    );

    return {
      data: rows.map((row: any) => ({
        clientId:         row.clientId,
        clientName:       row.clientName,
        documentsCount:   Number(row.documentsCount),
        lastDocumentDate: row.lastDocumentDate ?? null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  async getClientFolder(clientId: number, query: DocumentFolderQueryDto): Promise<any> {
    const page      = query.page      ?? 1;
    const limit     = query.limit     ?? 10;
    const search    = query.search?.trim() || null;
    const sortOrder = query.sortOrder ?? 'ASC';
    const sortCol   = CLIENT_SORT_COLUMNS[query.sortBy] ?? 'o.Id';
    const offset    = (page - 1) * limit;

    const clients = await this.dataSource.query(
      `SELECT Id, Name FROM client WHERE Id = ? LIMIT 1`,
      [clientId],
    );
    if (!clients.length) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }
    const client = clients[0];

    const searchClause = search
      ? `AND (o.OrderNumber LIKE ? OR o.OrderName LIKE ?)`
      : '';
    const searchParams = search ? [`%${search}%`, `%${search}%`] : [];

    const [countResult] = await this.dataSource.query(
      `SELECT COUNT(*) AS total FROM orders o
       WHERE o.ClientId = ? ${searchClause}`,
      [clientId, ...searchParams],
    );
    const total      = Number(countResult.total);
    const totalPages = Math.ceil(total / limit);

    const rows = await this.dataSource.query(
      `SELECT
        o.Id            AS orderId,
        o.OrderNumber,
        o.OrderName,
        COUNT(m.id)     AS documentsCount
      FROM orders o
      LEFT JOIN media_links ml ON ml.reference_type = 'order' AND ml.reference_id = o.Id
      LEFT JOIN media m        ON m.id = ml.media_id AND m.deleted_at IS NULL
      WHERE o.ClientId = ? ${searchClause}
      GROUP BY o.Id, o.OrderNumber, o.OrderName
      ORDER BY ${sortCol} ${sortOrder}
      LIMIT ? OFFSET ?`,
      [clientId, ...searchParams, limit, offset],
    );

    return {
      clientId:   client.Id,
      clientName: client.Name,
      folders: rows.map((row: any) => ({
        type:           'order',
        id:             row.orderId,
        name:           row.OrderNumber || `Order-${row.orderId}`,
        documentsCount: Number(row.documentsCount),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }

  async getOrderFolder(orderId: number, query: DocumentFolderQueryDto): Promise<any> {
    const page      = query.page      ?? 1;
    const limit     = query.limit     ?? 10;
    const search    = query.search?.trim() || null;
    const sortOrder = query.sortOrder ?? 'DESC';
    const sortCol   = ORDER_SORT_COLUMNS[query.sortBy] ?? 'm.uploaded_on';
    const offset    = (page - 1) * limit;

    const orders = await this.dataSource.query(
      `SELECT Id, OrderNumber FROM orders WHERE Id = ? LIMIT 1`,
      [orderId],
    );
    if (!orders.length) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    const order = orders[0];

    const searchClause = search ? `AND m.file_name LIKE ?` : '';
    const searchParams = search ? [`%${search}%`] : [];

    const [countResult] = await this.dataSource.query(
      `SELECT COUNT(*) AS total
       FROM media m
       INNER JOIN media_links ml ON ml.media_id = m.id
         AND ml.reference_type = 'order'
         AND ml.reference_id = ?
       WHERE m.deleted_at IS NULL ${searchClause}`,
      [orderId, ...searchParams],
    );
    const total      = Number(countResult.total);
    const totalPages = Math.ceil(total / limit);

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
      WHERE m.deleted_at IS NULL ${searchClause}
      ORDER BY ${sortCol} ${sortOrder}
      LIMIT ? OFFSET ?`,
      [orderId, ...searchParams, limit, offset],
    );

    return {
      orderId:     order.Id,
      orderNumber: order.OrderNumber || `Order-${order.Id}`,
      documents: rows.map((row: any) => ({
        id:         row.id,
        fileName:   row.fileName,
        fileType:   row.fileType,
        fileSize:   null,
        uploadedAt: row.uploadedAt ?? null,
        uploadedBy: row.uploadedBy ?? null,
        fileUrl:    this.buildFileUrl(row.file_url),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
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
