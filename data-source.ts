// data-source.ts

import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { ENTITIES } from 'src/database/Entities';
dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ENTITIES,
    migrations: [path.join(__dirname, '/src/migrations/**/*.{ts,js}')],
    synchronize: false,
    logging: true,
    migrationsRun: false,
})

export default AppDataSource;