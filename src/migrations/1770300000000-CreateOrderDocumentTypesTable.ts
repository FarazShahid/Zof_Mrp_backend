import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderDocumentTypesTable1770300000000 implements MigrationInterface {
    name = 'CreateOrderDocumentTypesTable1770300000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`orderdocumenttypes\` (
              \`Id\` INT NOT NULL AUTO_INCREMENT,
              \`Name\` VARCHAR(255) NOT NULL,
              \`IsRequired\` TINYINT NOT NULL DEFAULT 0,
              \`SupportedExtensions\` JSON NULL,
              \`CreatedBy\` VARCHAR(255) NULL,
              \`CreatedOn\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              \`UpdatedBy\` VARCHAR(255) NULL,
              \`UpdatedOn\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (\`Id\`),
              UNIQUE INDEX \`idx_orderdocumenttypes_name\` (\`Name\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`orderdocumenttypes\``);
    }
}
