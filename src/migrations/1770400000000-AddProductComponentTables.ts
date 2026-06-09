import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductComponentTables1770400000000 implements MigrationInterface {
    name = 'AddProductComponentTables1770400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create productcomponenttype table
        await queryRunner.query(`
            CREATE TABLE \`productcomponenttype\` (
                \`Id\` INT NOT NULL AUTO_INCREMENT,
                \`Name\` VARCHAR(255) NOT NULL,
                \`CreatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`UpdatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`CreatedBy\` VARCHAR(255) NULL,
                \`UpdatedBy\` VARCHAR(255) NULL,
                PRIMARY KEY (\`Id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        `);

        // Create productcomponent table
        await queryRunner.query(`
            CREATE TABLE \`productcomponent\` (
                \`Id\` INT NOT NULL AUTO_INCREMENT,
                \`ProductId\` INT NOT NULL,
                \`ComponentTypeId\` INT NOT NULL,
                \`FabricTypeId\` INT NOT NULL,
                \`CreatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`UpdatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (\`Id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        `);

        // Foreign key: productcomponent -> product
        await queryRunner.query(`
            ALTER TABLE \`productcomponent\`
            ADD CONSTRAINT \`FK_productcomponent_product\`
            FOREIGN KEY (\`ProductId\`)
            REFERENCES \`product\`(\`Id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        // Foreign key: productcomponent -> productcomponenttype
        await queryRunner.query(`
            ALTER TABLE \`productcomponent\`
            ADD CONSTRAINT \`FK_productcomponent_componenttype\`
            FOREIGN KEY (\`ComponentTypeId\`)
            REFERENCES \`productcomponenttype\`(\`Id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        // Foreign key: productcomponent -> fabrictype
        await queryRunner.query(`
            ALTER TABLE \`productcomponent\`
            ADD CONSTRAINT \`FK_productcomponent_fabrictype\`
            FOREIGN KEY (\`FabricTypeId\`)
            REFERENCES \`fabrictype\`(\`Id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        // Index on ProductId for fast lookups when fetching product details
        await queryRunner.query(`
            CREATE INDEX \`idx_productcomponent_product_id\`
            ON \`productcomponent\`(\`ProductId\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.query(`
            DROP INDEX \`idx_productcomponent_product_id\`
            ON \`productcomponent\`
        `);

        // Drop foreign keys from productcomponent
        await queryRunner.query(`
            ALTER TABLE \`productcomponent\`
            DROP FOREIGN KEY \`FK_productcomponent_fabrictype\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`productcomponent\`
            DROP FOREIGN KEY \`FK_productcomponent_componenttype\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`productcomponent\`
            DROP FOREIGN KEY \`FK_productcomponent_product\`
        `);

        // Drop tables (productcomponent first due to FK dependency)
        await queryRunner.query(`DROP TABLE \`productcomponent\``);
        await queryRunner.query(`DROP TABLE \`productcomponenttype\``);
    }
}
