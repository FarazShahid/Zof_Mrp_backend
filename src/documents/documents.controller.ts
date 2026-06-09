import {
  Get,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CommonApiResponses } from 'src/common/decorators/common-api-response.decorator';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AuditInterceptor } from 'src/audit-logs/audit.interceptor';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Documents', 'documents')
@UseInterceptors(AuditInterceptor)
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentsService: DocumentsService) {}

  @HasRight(AppRightsEnum.ViewOrders)
  @Get('folders')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all client folders (clients that have at least one document)')
  async getRootFolders() {
    try {
      return await this.documentsService.getRootFolders();
    } catch (error) {
      this.logger.error(`Error fetching root folders: ${error.message}`);
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewOrders)
  @Get('folders/client/:clientId')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all order folders inside a client folder')
  async getClientFolder(@Param('clientId', ParseIntPipe) clientId: number) {
    try {
      return await this.documentsService.getClientFolder(clientId);
    } catch (error) {
      this.logger.error(`Error fetching client folder ${clientId}: ${error.message}`);
      throw error;
    }
  }

  @HasRight(AppRightsEnum.ViewOrders)
  @Get('folders/order/:orderId')
  @HttpCode(HttpStatus.OK)
  @CommonApiResponses('Get all documents inside an order folder')
  async getOrderFolder(@Param('orderId', ParseIntPipe) orderId: number) {
    try {
      return await this.documentsService.getOrderFolder(orderId);
    } catch (error) {
      this.logger.error(`Error fetching order folder ${orderId}: ${error.message}`);
      throw error;
    }
  }
}
