import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTable1770100000000 implements MigrationInterface {
    name = 'CreateProjectTable1770100000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create project table
        await queryRunner.query(`
            CREATE TABLE \`project\` (
                \`Id\` INT NOT NULL AUTO_INCREMENT,
                \`Name\` VARCHAR(255) NOT NULL,
                \`Description\` VARCHAR(1000) NULL,
                \`ClientId\` INT NOT NULL,
                \`isArchived\` BOOLEAN NOT NULL DEFAULT FALSE,
                \`CreatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`UpdatedOn\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                \`CreatedBy\` VARCHAR(255) NOT NULL,
                \`UpdatedBy\` VARCHAR(255) NOT NULL,
                PRIMARY KEY (\`Id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        `);

        // Add foreign key constraint to client table
        await queryRunner.query(`
            ALTER TABLE \`project\`
            ADD CONSTRAINT \`FK_project_client\`
            FOREIGN KEY (\`ClientId\`)
            REFERENCES \`client\`(\`Id\`)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        `);

        // Add index for better query performance
        await queryRunner.query(`
            CREATE INDEX \`idx_project_client_id\`
            ON \`project\`(\`ClientId\`)
        `);

        // Add index on Name for better search performance
        await queryRunner.query(`
            CREATE INDEX \`idx_project_name\`
            ON \`project\`(\`Name\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`
            DROP INDEX \`idx_project_name\`
            ON \`project\`
        `);

        await queryRunner.query(`
            DROP INDEX \`idx_project_client_id\`
            ON \`project\`
        `);

        // Drop foreign key constraint
        await queryRunner.query(`
            ALTER TABLE \`project\`
            DROP FOREIGN KEY \`FK_project_client\`
        `);

        // Drop table
        await queryRunner.query(`
            DROP TABLE \`project\`
        `);
    }
}

