import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateColorOptionDto {
  @CommonApiProperty('Color Option Name', 'Color Option Name')
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  Name: string;

  @CommonApiProperty('Color Option Hex Code', 'Color Option Hex Code')
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  HexCode: string;
}
