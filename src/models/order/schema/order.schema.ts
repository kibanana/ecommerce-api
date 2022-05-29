import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CustomFieldValue, CustomFieldValueSchema } from '../../common/custom-field-value.schema';
import { Store } from '../../store/schema/store.schema';
import { Customer } from '../../customer/schema/customer.schema';
import { Product } from '../../product/schema/product.schema';
import { OrderStatus } from '../order.constant';

export type OrderDocument = Order & mongoose.Document;

@Schema()
export class Order {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
    store: Store;

    @Prop({ required: true, default: OrderStatus.IncompletePayment })
    status: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
    customer: Customer;

    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
    products: Product[];

    @Prop({ required: true })
    price: number;

	@Prop({ type: [CustomFieldValueSchema] })
    customFields: CustomFieldValue[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);