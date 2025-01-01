export class CreateOrderDto {
    ClientId: number;
    OrderEventId: number;
    Description?: string;
    OrderStatusId: number;
    Deadline: Date;
    items: any[];
  }
  