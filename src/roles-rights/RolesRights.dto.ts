import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleWithRightsDto {
  @ApiProperty({ example: 'Admin Role' })
  @IsString()
  name: string;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  rightIds: number[];
}
