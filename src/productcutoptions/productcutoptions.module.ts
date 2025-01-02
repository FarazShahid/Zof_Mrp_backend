
import { Module } from '@nestjs/common';
import { ProductcutoptionsController } from './productcutoptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { ProductcutoptionsService } from './productcutoptions.service';
import { ProductCutOption } from './entity/productcutoptions.entity';

@Module({
   imports: [
      TypeOrmModule.forFeature([ProductCutOption]),
      UserModule
    ],
  controllers: [ProductcutoptionsController],
  providers: [ProductcutoptionsService],
  exports: [ProductcutoptionsService],
  
})
export class ProductcutoptionsModule {}
