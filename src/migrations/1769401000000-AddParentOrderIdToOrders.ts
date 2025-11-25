import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParentOrderIdToOrders1769401000000 implements MigrationInterface {
    name = 'AddParentOrderIdToOrders1769401000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add ParentOrderId column
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD COLUMN \`ParentOrderId\` INT NULL AFTER \`OrderType\`
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            ADD CONSTRAINT \`FK_orders_parent_order\`
            FOREIGN KEY (\`ParentOrderId\`)
            REFERENCES \`orders\`(\`Id\`)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `);

        // Add index for better query performance
        await queryRunner.query(`
            CREATE INDEX \`idx_orders_parent_order_id\`
            ON \`orders\`(\`ParentOrderId\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.query(`
            DROP INDEX \`idx_orders_parent_order_id\`
            ON \`orders\`
        `);

        // Drop foreign key constraint
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            DROP FOREIGN KEY \`FK_orders_parent_order\`
        `);

        // Drop column
        await queryRunner.query(`
            ALTER TABLE \`orders\`
            DROP COLUMN \`ParentOrderId\`
        `);
    }
}

