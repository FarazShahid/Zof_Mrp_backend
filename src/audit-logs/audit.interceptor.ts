import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
  ) { }

  private sanitizePayload(payload: any): any {
    if (!payload || typeof payload !== 'object') {
      return payload;
    }

    const sensitiveFields = ['password', 'Password', 'PASSWORD', 'token', 'Token', 'TOKEN', 'secret', 'Secret', 'SECRET'];
    const sanitized = { ...payload };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Recursively sanitize nested objects
    for (const key in sanitized) {
      if (sanitized[key] && typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizePayload(sanitized[key]);
      }
    }

    return sanitized;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl: endpoint, ip, headers, body, params } = req;

    // Skip audit logging for refresh and logout endpoints (they don't have user context yet)
    const skipAuditPaths = ['/refresh', '/logout'];
    const shouldSkipAudit = skipAuditPaths.some(path => endpoint.includes(path));

    // For login endpoint, get user email from body since no token exists yet
    let user = req.user || {};
    if (endpoint.includes('/login') && body?.email) {
      user = { email: body.email, userId: 0 };
    }

    // Module = entity name from URL (/api/products → Products)
    const module = endpoint.split('/')[2]
      ? endpoint.split('/')[2].charAt(0).toUpperCase() + endpoint.split('/')[2].slice(1)
      : 'Unknown';

    // Detect action
    let action = 'Accessed';

    const determinePostAction = (url: string): string => {
      const u = url.toLowerCase();
      if (u.includes('/login')) return 'Logged In';
      if (u.includes('change-status') || u.includes('/status')) return 'Status Changed';
      if (u.includes('/upload')) return 'Uploaded';
      if (u.includes('/link')) return 'Linked';
      if (u.includes('/reorder')) return 'Reordered';
      if (u.includes('generate-download-pdf') || u.includes('/pdf')) return 'Generated PDF';
      if (u.includes('orders-items')) return 'Fetched Items';
      if (u.includes('/import')) return 'Imported';
      if (u.includes('/export')) return 'Exported';
      if (u.includes('/search')) return 'Searched';
      if (u.includes('/report')) return 'Generated Report';
      return 'Created';
    };

    if (method === 'POST') {
      action = determinePostAction(endpoint);
    } else if (method === 'PUT' || method === 'PATCH') {
      action = 'Updated';
    } else if (method === 'DELETE') {
      action = 'Deleted';
    }

    // Details = Smart description
    const sanitizedBody = this.sanitizePayload(body);
    const details =
      `${action} ${module}${params?.id ? ` with ID ${params.id}` : ''}` +
      (method !== 'GET' ? `, Payload: ${JSON.stringify(sanitizedBody)}` : '');

    return next.handle().pipe(
      tap(async (response) => {
        // Skip audit logging if flagged
        if (shouldSkipAudit) {
          return;
        }

        // If this was a login call and response contains user info, prefer it
        if (method === 'POST' && endpoint.includes('/login') && response?.user) {
          user = {
            email: response.user.email || user.email,
            userId: response.user.id ?? user.userId ?? 0,
          };
        }
        
        if (method !== 'GET' && user.userId && user.userId !== 0) {
          await this.auditLogService.createLog({
            UserId: user.userId,
            Module: module,
            Action: action,
            Details: details,
            EntityId: params?.id || null,
            Ip: ip,
            Device: headers['user-agent'],
          });
        }
      }),
    );
  }
}
