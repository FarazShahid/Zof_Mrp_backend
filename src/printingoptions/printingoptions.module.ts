import { Module } from '@nestjs/common';
import { PrintingoptionsController } from './printingoptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { PrintingoptionsService } from './printingoptions.service';
import { PrintingOptions } from './entities/printingoptions.entity';
import { ProductPrintingOptions } from 'src/products/entities/product-printing-options.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintingOptions, ProductPrintingOptions]),
    UserModule
  ],
  controllers: [PrintingoptionsController],
  providers: [PrintingoptionsService],
  exports: [PrintingoptionsService],

})
export class PrintingoptionsModule { }
