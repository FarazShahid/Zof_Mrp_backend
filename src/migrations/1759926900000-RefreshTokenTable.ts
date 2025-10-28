import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class RefreshTokenTable1759926900000 implements MigrationInterface {
  name = 'RefreshTokenTable1759926900000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tokenHash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'deviceInfo',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'isRevoked',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'revokedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'lastUsedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['Id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes for better performance (excluding userId as it's already indexed by foreign key)
    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_REFRESH_TOKENS_TOKEN_HASH',
        columnNames: ['tokenHash']
      })
    );

    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_REFRESH_TOKENS_EXPIRES_AT',
        columnNames: ['expiresAt']
      })
    );

    await queryRunner.createIndex(
      'refresh_tokens',
      new TableIndex({
        name: 'IDX_REFRESH_TOKENS_IS_REVOKED',
        columnNames: ['isRevoked']
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first (excluding userId index as it's managed by foreign key)
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_IS_REVOKED');
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_EXPIRES_AT');
    await queryRunner.dropIndex('refresh_tokens', 'IDX_REFRESH_TOKENS_TOKEN_HASH');

    // Drop the table
    await queryRunner.dropTable('refresh_tokens');
  }
}
