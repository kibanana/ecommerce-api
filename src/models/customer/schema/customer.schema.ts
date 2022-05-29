import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CustomFieldValue, CustomFieldValueSchema } from '../../common/custom-field-value.schema';
import { Store } from '../../store/schema/store.schema';

export type CustomerDocument = Customer & mongoose.Document;

@Schema()
export class Customer {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
	store: Store;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ type: [CustomFieldValueSchema] })
    customFields: CustomFieldValue[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);