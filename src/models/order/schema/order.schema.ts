import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Store } from '../../store/schema/store.schema';
import { Customer } from '../../customer/schema/customer.schema';
import { Product } from '../../product/schema/product.schema';

export type OrderDocument = Order & mongoose.Document;

@Schema()
export class Order {
    @Prop({ required: true, type: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' } })
    store: Store;

    @Prop({ required: true }) // TODO default value
    status: string;

    @Prop({ required: true, type: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' } })
    customer: Customer;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
    products: Product[];

    @Prop({ required: true })
    price: number;

    @Prop({
        type: [{
            name: { type: String },
            type: { type: String },
            value: { type: mongoose.Schema.Types.Mixed }
        }]
    })
    customFields: {
        name: string,
        type: string,
        value: mongoose.Schema.Types.Mixed
    }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);