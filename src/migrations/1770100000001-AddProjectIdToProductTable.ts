import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectIdToProductTable1770100000001 implements MigrationInterface {
    name = 'AddProjectIdToProductTable1770100000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add ProjectId column (nullable to maintain backward compatibility)
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD COLUMN \`ProjectId\` INT NULL AFTER \`ClientId\`
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD CONSTRAINT \`FK_product_project\`
            FOREIGN KEY (\`ProjectId\`)
            REFERENCES \`project\`(\`Id\`)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `);

        // Add index for better query performance
        await queryRunner.query(`
            CREATE INDEX \`idx_product_project_id\`
            ON \`product\`(\`ProjectId\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.query(`
            DROP INDEX \`idx_product_project_id\`
            ON \`product\`
        `);

        // Drop foreign key constraint
        await queryRunner.query(`
            ALTER TABLE \`product\`
            DROP FOREIGN KEY \`FK_product_project\`
        `);

        // Drop column
        await queryRunner.query(`
            ALTER TABLE \`product\`
            DROP COLUMN \`ProjectId\`
        `);
    }
}

