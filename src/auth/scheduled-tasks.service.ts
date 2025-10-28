import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(private readonly authService: AuthService) {}

  // Manual cleanup method - can be called from a cron job or scheduled task
  async handleExpiredTokensCleanup() {
    try {
      this.logger.log('Starting expired tokens cleanup...');
      const cleanedCount = await this.authService.cleanupExpiredTokens();
      this.logger.log(`Expired tokens cleanup completed. Removed ${cleanedCount} tokens.`);
      return cleanedCount;
    } catch (error) {
      this.logger.error(`Error during expired tokens cleanup: ${error.message}`, error.stack);
      throw error;
    }
  }
}
