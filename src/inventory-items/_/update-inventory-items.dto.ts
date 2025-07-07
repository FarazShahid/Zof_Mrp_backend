import { PartialType } from "@nestjs/swagger";
import { CreateInventoryItemDto } from "./create-items-categories.dto";

export class UpdateInventoryItemDto extends PartialType(CreateInventoryItemDto) {} 