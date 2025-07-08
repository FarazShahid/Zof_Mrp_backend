import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CommonApiProperty } from "src/common/decorators/common-api-response.decorator";

export class CreateShipmentCarrierDto {

    @CommonApiProperty('Carrier Name', 'TCS')
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    Name: string;
       
}
