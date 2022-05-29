import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { StoreOrderStatus } from '../order.constant';

export class UpdateStoreOrderDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(StoreOrderStatus)
    readonly status: string;

    constructor(status: string) {
        this.status = status;
    }
}