import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVersioningToSizeMeasurements1770000000000 implements MigrationInterface {
    name = 'AddVersioningToSizeMeasurements1770000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add versioning columns with safe defaults
        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            ADD COLUMN \`OriginalSizeMeasurementId\` INT NULL AFTER \`Id\`,
            ADD COLUMN \`Version\` INT NOT NULL DEFAULT 1 AFTER \`OriginalSizeMeasurementId\`,
            ADD COLUMN \`IsLatest\` BOOLEAN NOT NULL DEFAULT TRUE AFTER \`Version\`,
            ADD COLUMN \`IsActive\` BOOLEAN NOT NULL DEFAULT TRUE AFTER \`IsLatest\`
        `);

        // Add foreign key constraint for self-reference
        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            ADD CONSTRAINT \`FK_sizemeasurements_original\`
            FOREIGN KEY (\`OriginalSizeMeasurementId\`)
            REFERENCES \`sizemeasurements\`(\`Id\`)
            ON DELETE RESTRICT
            ON UPDATE CASCADE
        `);

        // Add indexes for performance
        await queryRunner.query(`
            CREATE INDEX \`idx_sizeoption_latest\`
            ON \`sizemeasurements\`(\`SizeOptionId\`, \`IsLatest\`, \`IsActive\`)
        `);

        await queryRunner.query(`
            CREATE INDEX \`idx_original_version\`
            ON \`sizemeasurements\`(\`OriginalSizeMeasurementId\`, \`Version\`)
        `);

        // Verify existing data - all should have:
        // OriginalSizeMeasurementId = NULL (they are originals)
        // Version = 1 (default applied)
        // IsLatest = TRUE (default applied)
        // IsActive = TRUE (default applied)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`
            DROP INDEX \`idx_original_version\`
            ON \`sizemeasurements\`
        `);

        await queryRunner.query(`
            DROP INDEX \`idx_sizeoption_latest\`
            ON \`sizemeasurements\`
        `);

        // Drop foreign key constraint
        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            DROP FOREIGN KEY \`FK_sizemeasurements_original\`
        `);

        // Drop columns
        await queryRunner.query(`
            ALTER TABLE \`sizemeasurements\`
            DROP COLUMN \`IsActive\`,
            DROP COLUMN \`IsLatest\`,
            DROP COLUMN \`Version\`,
            DROP COLUMN \`OriginalSizeMeasurementId\`
        `);
    }
}

