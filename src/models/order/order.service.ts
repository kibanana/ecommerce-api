import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrderListDto } from './dto/get-order-list.dto';
import { Order, OrderDocument } from './schema/order.schema';
import { GetOrderItemDto } from './dto/get-order-item.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}

    createItem(store: string, customer: string, { products, price, customFields }: CreateOrderDto) {
        const order = new this.orderModel({ store, customer, products, price, customFields });
        return order.save();
    }

    async getList(store: string, { offset, limit }: GetOrderListDto) {
        const list = await this.orderModel
            .find(
                { store },
                { customFields: false },
                { skip: offset * limit, limit }
            )
            .populate({
                path: 'customer',
                select: { name: true }
            })
            .populate({
                path: 'products',
                select: { name: true, price: true }
            });

        const count = await this.orderModel.countDocuments({ store });

        return { list, count };
    }

    async getListByCustomer(store: string, customer: string, { offset, limit }: GetOrderListDto) {
        const list = await this.orderModel
            .find(
                { store, customer },
                { customFields: false },
                { skip: offset * limit, limit }
            )
            .populate({
                path: 'products',
                select: { name: true, price: true }
            });

        const count = await this.orderModel.countDocuments({ store });

        return { list, count };
    }

    getItemByStore(store: string, { id }: GetOrderItemDto) {
        return this.orderModel
            .findOne({ id, store })
            .populate({
                path: 'customer',
                select: { name: true, email: true }
            })
            .populate({
                path: 'products',
                select: { name: true, price: true }
            });
    }

    getItemByCustomer(customer: string, { id }: GetOrderItemDto) {
        return this.orderModel
            .findOne({ id, customer })
            .populate({
                path: 'products',
                select: { name: true, price: true, customFields: true }
            });
    }

    updateItem(id: string, status: string) {
        return this.orderModel.findByIdAndUpdate(id, { status });
    }
}
