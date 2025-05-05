import { IsString, IsInt, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateFabricTypeDto {
  @CommonApiProperty('Fabric Type', 'Fabric Type')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  type: string;

  @CommonApiProperty('Fabric Type Name', 'Fabric Type Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @CommonApiProperty('Fabric Type GSM', 'Fabric Type GSM')
  @IsInt()
  @IsNotEmpty()
  gsm: number;

  @CommonApiProperty('Optional Category Id', 1)
  @IsOptional()
  CategoryId: number;
}
