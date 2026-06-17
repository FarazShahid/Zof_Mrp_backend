import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubCategoryAndStyleNumberToOrderItemDetails1770500000002 implements MigrationInterface {
    name = 'AddSubCategoryAndStyleNumberToOrderItemDetails1770500000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add nullable ProductSubCategoryId and StyleNumber columns to orderitemdetails
        await queryRunner.query(`
            ALTER TABLE \`orderitemdetails\`
            ADD COLUMN \`ProductSubCategoryId\` INT NULL,
            ADD COLUMN \`StyleNumber\` VARCHAR(100) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`orderitemdetails\`
            DROP COLUMN \`ProductSubCategoryId\`,
            DROP COLUMN \`StyleNumber\`
        `);
    }
}
