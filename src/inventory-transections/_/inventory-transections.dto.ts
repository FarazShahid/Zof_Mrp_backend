import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';
import { CommonApiProperty } from 'src/common/decorators/common-api-response.decorator';

export class CreateInventoryTransectionsDto {
    @CommonApiProperty('Inventory Item ID', '1')
    @IsNumber()
    @IsNotEmpty()
    InventoryItemId: number;

    @CommonApiProperty('Quantity', '2')
    @IsNumber()
    @IsNotEmpty()
    Quantity: number;

    @CommonApiProperty('Transection Type Name', 'In')
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    TransactionType: string;
}