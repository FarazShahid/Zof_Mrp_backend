import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderCommentsTable1759930000000 implements MigrationInterface {
    name = 'OrderCommentsTable1759930000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`ordercomments\` (
              \`Id\` INT NOT NULL AUTO_INCREMENT,
              \`OrderId\` INT NOT NULL,
              \`Comment\` TEXT NOT NULL,
              \`CreatedBy\` VARCHAR(255) NOT NULL,
              \`CreatedOn\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              \`UpdatedBy\` VARCHAR(255) NULL,
              \`UpdatedOn\` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (\`Id\`),
              CONSTRAINT \`FK_ordercomments_orders\` 
                FOREIGN KEY (\`OrderId\`) 
                REFERENCES \`orders\` (\`Id\`) 
                ON DELETE CASCADE
                ON UPDATE CASCADE,
              INDEX \`idx_ordercomments_orderid\` (\`OrderId\`),
              INDEX \`idx_ordercomments_createdon\` (\`CreatedOn\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS \`ordercomments\``);
    }
}


