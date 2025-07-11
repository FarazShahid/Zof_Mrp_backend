import { Module } from '@nestjs/common';
import { SizeoptionsController } from './sizeoptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { SizeoptionsService } from './sizeoptions.service';
import { SizeOption } from './entities/sizeoptions.entity';
import { AvailbleSizeOptions } from 'src/products/entities/available-size-options';

@Module({
  imports: [
    TypeOrmModule.forFeature([SizeOption, AvailbleSizeOptions]),
    UserModule
  ],
  controllers: [SizeoptionsController],
  providers: [SizeoptionsService],
  exports: [SizeoptionsService],

})
export class SizeoptionsModule { }
