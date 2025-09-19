import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateQaChecklistZipDto {
  @ApiProperty({ type: [Number], example: [101, 102, 103] })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  itemIds: number[];
}