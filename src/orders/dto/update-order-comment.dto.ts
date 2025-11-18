import { IsString, IsOptional, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class UpdateOrderCommentDto {
  @CommonApiProperty('Comment', 'Updated comment text')
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  Comment?: string;
}


