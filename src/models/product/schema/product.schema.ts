import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Store } from '../../store/schema/store.schema';

export type ProductDocument = Product & mongoose.Document;

@Schema()
export class Product {
    @Prop({ required: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }] })
    store: Store;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    categories: string[];

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

export const ProductSchema = SchemaFactory.createForClass(Product);