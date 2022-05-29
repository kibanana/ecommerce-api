import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Store } from '../../store/schema/store.schema';
import { CustomFieldValueSchema, CustomFieldValue } from '../../common/custom-field-value.schema';

export type ProductDocument = Product & mongoose.Document;

@Schema()
export class Product {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
    store: Store;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    categories: string[];

    @Prop({ type: [CustomFieldValueSchema] })
    customFields: CustomFieldValue[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);