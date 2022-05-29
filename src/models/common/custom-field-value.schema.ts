
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { CustomField } from '../custom-field/schema/custom-field.schema';

@Schema()
export class CustomFieldValue {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'CustomField' })
	customField: CustomField;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    value:  mongoose.Schema.Types.Mixed;
}

export const CustomFieldValueSchema = SchemaFactory.createForClass(CustomFieldValue);