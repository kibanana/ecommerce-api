import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Store } from '../../store/schema/store.schema';

export type CustomFieldDocument = CustomField & mongoose.Document;

@Schema()
export class CustomField {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
	store: Store;

	@Prop({ required: true })
	target: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	type: string;

	@Prop({ required: true, type: mongoose.Schema.Types.Mixed })
	subType: mongoose.Schema.Types.Mixed;

	@Prop({ required: true })
	isRequired: boolean;

	@Prop({ default: false })
	isOnlyStoreWritable: boolean;
}

export const CustomFieldSchema = SchemaFactory.createForClass(CustomField);