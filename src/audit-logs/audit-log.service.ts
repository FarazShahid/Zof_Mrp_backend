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
  ) {}

  async createLog(data: Partial<AuditLog>) {
    const log = this.auditLogRepo.create(data);
    return this.auditLogRepo.save(log);
  }

async getLogs(): Promise<any[]> {
    return this.auditLogRepo
      .createQueryBuilder('log')
      .leftJoinAndSelect(User, 'user', 'user.id = log.userId')
      .select([
        'log.id',
        'log.module',
        'log.action',
        'log.details',
        'log.entityId',
        'log.ip',
        'log.device',
        'log.createdAt',
        'user.id AS userId',
        'user.Email AS Email', // include name
      ])
      .orderBy('log.createdAt', 'DESC')
      .getRawMany();
  }

}
