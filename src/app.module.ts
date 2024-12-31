import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from './clients/clients.module';
import { Client } from './clients/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'zof_mrp',
    entities: [Client],
    // Make Sync False for Prod
    synchronize: true
  }), ClientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
