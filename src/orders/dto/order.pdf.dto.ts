// src/orders/dto/generate-order-pdfs.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';

export enum PdfType {
  SPECIFICATION = 'specification',
  SUMMARY = 'summary',
}

export class GenerateOrderPdfsDto {
  @ApiProperty({ example: 123 })
  @IsInt()
  orderId: number;

  @ApiProperty({ enum: PdfType, example: PdfType.SPECIFICATION })
  @IsEnum(PdfType)
  pdfType: PdfType;
}
