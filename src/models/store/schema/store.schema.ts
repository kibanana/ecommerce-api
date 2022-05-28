import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type StoreDocument = Store & mongoose.Document;

@Schema()
export class Store {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);