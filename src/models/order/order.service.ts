import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}

    createItem(store: string, customer: string, { products, price, customFields }: CreateOrderDto) {
        const order = new this.orderModel({ store, customer, products, price, customFields });
        return order.save();
    }
}
