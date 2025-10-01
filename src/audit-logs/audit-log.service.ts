import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) { }

  async createLog(data: Partial<AuditLog>) {
    const log = this.auditLogRepo.create(data);
    return this.auditLogRepo.save(log);
  }

  async getLogs(): Promise<any[]> {
    return this.auditLogRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect(User, 'user', 'user.Id = log.UserId')
      .select([
        'log.Id as id',
        'log.ModuleId as moduleId',
        'log.Action as action',
        'log.Details as details',
        'log.EntityId as entityId',
        'log.Ip as ip',
        'log.Device as device',
        'log.CreatedAt as createdAt',
        'user.Id AS userId',
        'user.Email AS Email',
      ])
      .orderBy('log.CreatedAt', 'DESC')
      .getRawMany();
  }

}
