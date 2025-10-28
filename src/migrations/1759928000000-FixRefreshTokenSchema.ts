import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRefreshTokenSchema1759928000000 implements MigrationInterface {
  name = 'FixRefreshTokenSchema1759928000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, let's check if the problematic index exists and drop it if it does
    const indexExists = await queryRunner.query(`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'refresh_tokens' 
      AND INDEX_NAME = 'IDX_REFRESH_TOKENS_USER_ID'
    `);

    if (indexExists[0].count > 0) {
      // Drop the foreign key constraint first
      await queryRunner.query(`
        ALTER TABLE refresh_tokens 
        DROP FOREIGN KEY FK_610102b60fea1455310ccd299de
      `);
      
      // Drop the problematic index
      await queryRunner.query(`
        DROP INDEX IDX_REFRESH_TOKENS_USER_ID ON refresh_tokens
      `);
      
      // Recreate the foreign key constraint (this will automatically create the needed index)
      await queryRunner.query(`
        ALTER TABLE refresh_tokens 
        ADD CONSTRAINT FK_610102b60fea1455310ccd299de 
        FOREIGN KEY (userId) REFERENCES users(Id) ON DELETE CASCADE
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // This migration is not reversible as it fixes a schema conflict
    // The down method is intentionally left empty
  }
}

