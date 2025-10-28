import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRefreshTokenIndexes1759927000000 implements MigrationInterface {
  name = 'FixRefreshTokenIndexes1759927000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the problematic userId index that conflicts with foreign key
    try {
      await queryRunner.query('DROP INDEX `IDX_REFRESH_TOKENS_USER_ID` ON `refresh_tokens`');
    } catch (error) {
      // Index might not exist, continue
      console.log('Index IDX_REFRESH_TOKENS_USER_ID does not exist or already dropped');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate the userId index if needed
    await queryRunner.query('CREATE INDEX `IDX_REFRESH_TOKENS_USER_ID` ON `refresh_tokens` (`userId`)');
  }
}

