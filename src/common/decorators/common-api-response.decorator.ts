import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function CommonApiResponses(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Request was successful.' }),
    ApiResponse({ status: 201, description: 'Resource successfully created.' }),
    ApiResponse({ status: 204, description: 'No content - Resource deleted successfully.' }),
    ApiResponse({ status: 400, description: 'Bad request - Invalid input.' }),
    ApiResponse({ status: 401, description: 'Unauthorized - JWT token is missing or invalid.' }),
    ApiResponse({ status: 403, description: 'Forbidden - Access denied.' }),
    ApiResponse({ status: 404, description: 'Not found - Resource does not exist.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export type ApiPropertyExample = string | number | boolean | string[] | number[] | boolean[] | Record<string, unknown>;

export const CommonApiProperty = (
  description: string = '',
  example?: ApiPropertyExample,
  isRequired: boolean = true
) => {
  return ApiProperty({
    description,
    example,
    required: isRequired,
  });
};

export const CommonApiResponseModal = <TModel extends Type<unknown>>(typeData: TModel) => (ApiResponse({type: typeData}))