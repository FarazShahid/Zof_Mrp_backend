import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubCategoryAndStyleNumberToSizeMeasurements1770500000001 implements MigrationInterface {
    name = 'AddSubCategoryAndStyleNumberToSizeMeasurements1770500000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add nullable ProductSubCategoryId and StyleNumber columns to sizemeasurements
        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            ADD COLUMN \`ProductSubCategoryId\` INT NULL,
            ADD COLUMN \`StyleNumber\` VARCHAR(100) NULL
        `);

        // Foreign key: sizemeasurements.ProductSubCategoryId -> productsubcategory.Id
        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            ADD CONSTRAINT \`FK_sizemeasurements_productsubcategory\`
            FOREIGN KEY (\`ProductSubCategoryId\`)
            REFERENCES \`productsubcategory\`(\`Id\`)
            ON DELETE SET NULL
            ON UPDATE CASCADE
        `);

        // Index to speed up lookups/matching by sub category and style number
        await queryRunner.query(`
            CREATE INDEX \`idx_sizemeasurements_subcategory_style\`
            ON \`sizemeasurements\`(\`ProductSubCategoryId\`, \`StyleNumber\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`idx_sizemeasurements_subcategory_style\`
            ON \`sizemeasurements\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            DROP FOREIGN KEY \`FK_sizemeasurements_productsubcategory\`
        `);

        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            DROP COLUMN \`ProductSubCategoryId\`,
            DROP COLUMN \`StyleNumber\`
        `);
    }
}
