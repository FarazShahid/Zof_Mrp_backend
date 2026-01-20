import { MigrationInterface, QueryRunner } from "typeorm";

export class  $MIGRATIONNAME1770200738130 implements MigrationInterface {
    name = ' $MIGRATIONNAME1770200738130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`auditlogs\` DROP FOREIGN KEY \`FK_002a4d398ca4c20bd2d2a60f6f1\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_project_client\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_product_project\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_parent_order\``);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` DROP FOREIGN KEY \`FK_ordercomments_orders\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP FOREIGN KEY \`FK_sizemeasurements_original\``);
        await queryRunner.query(`DROP INDEX \`idx_project_client_id\` ON \`project\``);
        await queryRunner.query(`DROP INDEX \`idx_project_name\` ON \`project\``);
        await queryRunner.query(`DROP INDEX \`idx_product_project_id\` ON \`product\``);
        await queryRunner.query(`DROP INDEX \`idx_orders_parent_order_id\` ON \`orders\``);
        await queryRunner.query(`DROP INDEX \`idx_ordercomments_createdon\` ON \`ordercomments\``);
        await queryRunner.query(`DROP INDEX \`idx_ordercomments_orderid\` ON \`ordercomments\``);
        await queryRunner.query(`DROP INDEX \`idx_original_version\` ON \`sizemeasurements\``);
        await queryRunner.query(`DROP INDEX \`idx_sizeoption_latest\` ON \`sizemeasurements\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_Height\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_Length\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_Depth\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_HandleGrip\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_ShoulderStrap_Full_Length\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_FrontPocketLength\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_FrontPocketHeight\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_SidePocketLength\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Bag_SidePocketHeight\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Cap_CrownCircumference\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Cap_BrimLength\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Cap_BrimWidth\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Cap_Height\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`Cap_Crown_Width\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD \`cap_cuff_height\` decimal(5,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`isArchived\` \`isArchived\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`ShipmentDate\` \`ShipmentDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`Status\` \`Status\` enum ('In Transit', 'Damaged', 'Delivered', 'Cancelled', 'Dispatched') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` CHANGE \`CreatedOn\` \`CreatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` CHANGE \`UpdatedOn\` \`UpdatedOn\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` CHANGE \`IsLatest\` \`IsLatest\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` CHANGE \`IsActive\` \`IsActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`auditlogs\` ADD CONSTRAINT \`FK_002a4d398ca4c20bd2d2a60f6f1\` FOREIGN KEY (\`UserId\`) REFERENCES \`users\`(\`Id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_a981604eacc9921c5d9cd6035a9\` FOREIGN KEY (\`ClientId\`) REFERENCES \`client\`(\`Id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_534173f36c89fc2e3235e9408b6\` FOREIGN KEY (\`ProjectId\`) REFERENCES \`project\`(\`Id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_7027388f260d27e8143efb12025\` FOREIGN KEY (\`ParentOrderId\`) REFERENCES \`orders\`(\`Id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` ADD CONSTRAINT \`FK_6858c31778195a6f74139a60775\` FOREIGN KEY (\`OrderId\`) REFERENCES \`orders\`(\`Id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD CONSTRAINT \`FK_9c99b39581aa5313b77b148ea2c\` FOREIGN KEY (\`OriginalSizeMeasurementId\`) REFERENCES \`sizemeasurements\`(\`Id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP FOREIGN KEY \`FK_9c99b39581aa5313b77b148ea2c\``);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` DROP FOREIGN KEY \`FK_6858c31778195a6f74139a60775\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_7027388f260d27e8143efb12025\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_534173f36c89fc2e3235e9408b6\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_a981604eacc9921c5d9cd6035a9\``);
        await queryRunner.query(`ALTER TABLE \`auditlogs\` DROP FOREIGN KEY \`FK_002a4d398ca4c20bd2d2a60f6f1\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` CHANGE \`IsActive\` \`IsActive\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` CHANGE \`IsLatest\` \`IsLatest\` tinyint(1) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` CHANGE \`UpdatedOn\` \`UpdatedOn\` timestamp(0) NULL ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` CHANGE \`CreatedOn\` \`CreatedOn\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`Status\` \`Status\` enum COLLATE "utf8mb4_general_ci" ('In Transit', 'Dispatched', 'Damaged', 'Delivered', 'Cancelled', 'Returned', 'Pending Pickup', 'Processing') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shipment\` CHANGE \`ShipmentDate\` \`ShipmentDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`isArchived\` \`isArchived\` tinyint(1) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`cap_cuff_height\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Cap_Crown_Width\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Cap_Height\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Cap_BrimWidth\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Cap_BrimLength\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Cap_CrownCircumference\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_SidePocketHeight\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_SidePocketLength\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_FrontPocketHeight\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_FrontPocketLength\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_ShoulderStrap_Full_Length\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_HandleGrip\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_Depth\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_Length\``);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` DROP COLUMN \`Bag_Height\``);
        await queryRunner.query(`CREATE INDEX \`idx_sizeoption_latest\` ON \`sizemeasurements\` (\`SizeOptionId\`, \`IsLatest\`, \`IsActive\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_original_version\` ON \`sizemeasurements\` (\`OriginalSizeMeasurementId\`, \`Version\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_ordercomments_orderid\` ON \`ordercomments\` (\`OrderId\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_ordercomments_createdon\` ON \`ordercomments\` (\`CreatedOn\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_orders_parent_order_id\` ON \`orders\` (\`ParentOrderId\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_product_project_id\` ON \`product\` (\`ProjectId\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_project_name\` ON \`project\` (\`Name\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_project_client_id\` ON \`project\` (\`ClientId\`)`);
        await queryRunner.query(`ALTER TABLE \`sizemeasurements\` ADD CONSTRAINT \`FK_sizemeasurements_original\` FOREIGN KEY (\`OriginalSizeMeasurementId\`) REFERENCES \`sizemeasurements\`(\`Id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ordercomments\` ADD CONSTRAINT \`FK_ordercomments_orders\` FOREIGN KEY (\`OrderId\`) REFERENCES \`orders\`(\`Id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_orders_parent_order\` FOREIGN KEY (\`ParentOrderId\`) REFERENCES \`orders\`(\`Id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_product_project\` FOREIGN KEY (\`ProjectId\`) REFERENCES \`project\`(\`Id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_project_client\` FOREIGN KEY (\`ClientId\`) REFERENCES \`client\`(\`Id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`auditlogs\` ADD CONSTRAINT \`FK_002a4d398ca4c20bd2d2a60f6f1\` FOREIGN KEY (\`UserId\`) REFERENCES \`users\`(\`Id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

}
