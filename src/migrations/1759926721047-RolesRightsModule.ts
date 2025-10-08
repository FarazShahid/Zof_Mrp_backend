import { MigrationInterface, QueryRunner } from "typeorm";

export class RolesRightsModule1759926721047 implements MigrationInterface {
    name = 'RolesRightsModule1759926721047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auditlogs\` DROP FOREIGN KEY \`FK_002a4d398ca4c20bd2d2a60f6f1\``);
        await queryRunner.query(`CREATE TABLE \`app_rights\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NULL, \`group_by\` varchar(50) NULL, \`CreatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(100) NULL, \`UpdatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(100) NULL, \`deletedOn\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`app_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NULL, \`CreatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(100) NULL, \`UpdatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(100) NULL, \`deletedOn\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`app_roles_rights\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roleId\` int NOT NULL, \`rightId\` int NOT NULL, \`CreatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(100) NULL, \`UpdatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(100) NULL, \`deletedOn\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`firstName\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastName\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`roleId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`assignedClients\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`CreatedOn\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`CreatedOn\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`UpdatedOn\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`UpdatedOn\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`ShipmentDate\` \`ShipmentDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`app_roles_rights\` ADD CONSTRAINT \`FK_91ebd6438603125ec00e42ba9a9\` FOREIGN KEY (\`roleId\`) REFERENCES \`app_roles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`app_roles_rights\` ADD CONSTRAINT \`FK_4e018f4069c7d1aa93e5672910f\` FOREIGN KEY (\`rightId\`) REFERENCES \`app_rights\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`app_roles\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`auditlogs\` ADD CONSTRAINT \`FK_002a4d398ca4c20bd2d2a60f6f1\` FOREIGN KEY (\`UserId\`) REFERENCES \`users\`(\`Id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auditlogs\` DROP FOREIGN KEY \`FK_002a4d398ca4c20bd2d2a60f6f1\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`app_roles_rights\` DROP FOREIGN KEY \`FK_4e018f4069c7d1aa93e5672910f\``);
        await queryRunner.query(`ALTER TABLE \`app_roles_rights\` DROP FOREIGN KEY \`FK_91ebd6438603125ec00e42ba9a9\``);
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`ShipmentDate\` \`ShipmentDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`UpdatedOn\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`UpdatedOn\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`CreatedOn\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`CreatedOn\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`assignedClients\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roleId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`DROP TABLE \`app_roles_rights\``);
        await queryRunner.query(`DROP TABLE \`app_roles\``);
        await queryRunner.query(`DROP TABLE \`app_rights\``);
        await queryRunner.query(`ALTER TABLE \`auditlogs\` ADD CONSTRAINT \`FK_002a4d398ca4c20bd2d2a60f6f1\` FOREIGN KEY (\`UserId\`) REFERENCES \`users\`(\`Id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

}
