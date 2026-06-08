import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/orders.entity';
import { OrderDocumentTypesService } from 'src/order-document-types/order-document-types.service';
import { MediaHandlersService } from 'src/media-handlers/media-handlers.service';
import { MediaLink } from 'src/media-link/_/media-link.entity';

export interface OrderDocumentStatus {
  documentTypeId: number;
  documentTypeName: string;
  isRequired: boolean;
  uploaded: boolean;
  fileUrl: string | null;
}

export interface OrderAttachmentSummary {
  attachmentProgress: number;
  documents: OrderDocumentStatus[];
}

const ORDER_REFERENCE_TYPE = 'order';

@Injectable()
export class OrderDocumentsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly orderDocumentTypesService: OrderDocumentTypesService,
    private readonly mediaHandlersService: MediaHandlersService,
  ) {}

  async uploadDocuments(
    orderId: number,
    files: Express.Multer.File[],
    typeIds: number[],
    userEmail: string,
  ): Promise<{ message: string; documents: any[] }> {
    const order = await this.orderRepository.findOne({ where: { Id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (!files?.length) {
      throw new BadRequestException('At least one document file is required.');
    }

    if (files.length !== typeIds.length) {
      throw new BadRequestException('Each uploaded document must have a corresponding typeId.');
    }

    const documentTypes = await this.orderDocumentTypesService.findAll();
    const documentTypeById = new Map(documentTypes.map((type) => [type.Id, type]));

    for (let i = 0; i < typeIds.length; i++) {
      const typeId = typeIds[i];
      const documentType = documentTypeById.get(typeId);
      if (!Number.isFinite(typeId) || !documentType) {
        throw new BadRequestException(`Invalid typeId "${typeIds[i]}": no matching order document type exists.`);
      }

      const extension = files[i].originalname.split('.').pop()?.toLowerCase();
      const supportedExtensions = documentType.SupportedExtensions?.map((ext) => ext.toLowerCase());
      if (supportedExtensions?.length && (!extension || !supportedExtensions.includes(extension))) {
        throw new BadRequestException(
          `File "${files[i].originalname}" has an unsupported extension for document type "${documentType.Name}". Supported extensions: ${supportedExtensions.join(', ')}.`,
        );
      }
    }

    const uploaded: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const typeId = typeIds[i];
      const documentType = documentTypeById.get(typeId)!;
      const result = await this.mediaHandlersService.uploadFileAndLink(
        files[i],
        userEmail,
        ORDER_REFERENCE_TYPE,
        orderId,
        documentType.Name,
        typeId,
      );
      uploaded.push({
        typeId,
        typeName: documentType.Name,
        ...result,
      });
    }

    return { message: 'Documents uploaded and linked successfully', documents: uploaded };
  }

  async getAttachmentProgress(orderId: number): Promise<number> {
    const summaries = await this.getAttachmentSummaries([orderId]);
    return summaries.get(orderId)?.attachmentProgress ?? 0;
  }

  async getOrderDocumentsSummary(orderId: number): Promise<OrderAttachmentSummary> {
    const summaries = await this.getAttachmentSummaries([orderId]);
    return summaries.get(orderId) ?? { attachmentProgress: 0, documents: [] };
  }

  /**
   * Computes attachment progress and per-type document status for many orders at once,
   * issuing a single batch query for the linked media instead of one query per order.
   */
  async getAttachmentSummaries(orderIds: number[]): Promise<Map<number, OrderAttachmentSummary>> {
    const summaries = new Map<number, OrderAttachmentSummary>();
    if (!orderIds.length) {
      return summaries;
    }

    const documentTypes = await this.orderDocumentTypesService.findAll();
    const requiredCount = documentTypes.filter((type) => type.IsRequired).length;

    const links = await this.mediaHandlersService.getDocumentsByReferenceIds(ORDER_REFERENCE_TYPE, orderIds);
    const uploadedByOrder = new Map<number, Map<number, MediaLink>>();
    for (const link of links) {
      const typeId = link.media?.typeId;
      if (typeId == null) {
        continue;
      }
      if (!uploadedByOrder.has(link.reference_id)) {
        uploadedByOrder.set(link.reference_id, new Map());
      }
      const typeMap = uploadedByOrder.get(link.reference_id)!;
      if (!typeMap.has(typeId)) {
        typeMap.set(typeId, link);
      }
    }

    for (const orderId of orderIds) {
      const uploadedTypes = uploadedByOrder.get(orderId);

      const documents: OrderDocumentStatus[] = documentTypes.map((type) => {
        const link = uploadedTypes?.get(type.Id);
        return {
          documentTypeId: type.Id,
          documentTypeName: type.Name,
          isRequired: type.IsRequired,
          uploaded: !!link,
          fileUrl: link?.media?.file_url ?? null,
        };
      });

      const uploadedRequiredCount = documentTypes.filter(
        (type) => type.IsRequired && uploadedTypes?.has(type.Id),
      ).length;

      const attachmentProgress = requiredCount > 0 ? Math.round((uploadedRequiredCount / requiredCount) * 100) : 0;

      summaries.set(orderId, { attachmentProgress, documents });
    }

    return summaries;
  }
}
