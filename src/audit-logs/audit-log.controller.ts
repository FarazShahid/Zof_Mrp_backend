import { Get } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ControllerAuthProtector } from 'src/common/decorators/controller-auth-protector';
import { AppRightsEnum } from 'src/roles-rights/roles-rights.enum';
import { HasRight } from 'src/auth/has-right-guard';

@ControllerAuthProtector('Audit Logs', 'audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @HasRight(AppRightsEnum.ViewAuditLogs)
  @Get()
  async getLogs() {
    return this.auditLogService.getLogs();
  }
}
