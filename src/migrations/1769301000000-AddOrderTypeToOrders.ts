import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderTypeToOrders1769301000000 implements MigrationInterface {
    name = 'AddOrderTypeToOrders1769301000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD COLUMN \`OrderType\` VARCHAR(100) NULL AFTER \`OrderName\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            DROP COLUMN \`OrderType\`
        `);
    }
}

