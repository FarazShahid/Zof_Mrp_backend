import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductSubCategoryTable1770500000000 implements MigrationInterface {
    name = 'AddProductSubCategoryTable1770500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create productsubcategory table
        await queryRunner.query(`
            CREATE TABLE \`productsubcategory\` (
                \`Id\` INT NOT NULL AUTO_INCREMENT,
                \`Name\` VARCHAR(255) NOT NULL,
                \`ProductCategoryId\` INT NOT NULL,
                \`CreatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`UpdatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`CreatedBy\` VARCHAR(255) NULL,
                \`UpdatedBy\` VARCHAR(255) NULL,
                PRIMARY KEY (\`Id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        `);

        // Foreign key: productsubcategory -> productcategory
        await queryRunner.query(`
            ALTER TABLE \`productsubcategory\`
            ADD CONSTRAINT \`FK_productsubcategory_productcategory\`
            FOREIGN KEY (\`ProductCategoryId\`)
            REFERENCES \`productcategory\`(\`Id\`)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
        `);

        // Index on ProductCategoryId for fast lookups/filters
        await queryRunner.query(`
            CREATE INDEX \`idx_productsubcategory_category_id\`
            ON \`productsubcategory\`(\`ProductCategoryId\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`idx_productsubcategory_category_id\`
            ON \`productsubcategory\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`productsubcategory\`
            DROP FOREIGN KEY \`FK_productsubcategory_productcategory\`
        `);

        await queryRunner.query(`DROP TABLE \`productsubcategory\``);
    }
}
