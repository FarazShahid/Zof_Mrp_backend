import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateOrderCommentDto {
  @CommonApiProperty('Comment', 'This is a comment about the order')
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  Comment: string;
}


