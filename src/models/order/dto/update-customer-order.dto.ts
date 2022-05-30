import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { CustomerOrderStatus } from '../order.constant';

export class UpdateCustomerOrderDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(CustomerOrderStatus)
    readonly status: string;

    constructor(status: string) {
        this.status = status;
    }
}