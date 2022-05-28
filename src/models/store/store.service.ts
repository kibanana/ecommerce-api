import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { StoreCreateDto } from './dto/storeCreate.dto';
import { Store, StoreDocument } from './schema/store.schema';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    ) {}

    createItem({ name, email, password }: StoreCreateDto) {
        const store = new this.storeModel({ name, email, password });
        return store.save();
    }

    getItemById(id: string) {
        return this.storeModel.findById(id);
    }

    getItem(email: string) {
        return this.storeModel.findOne({ email });
    }
}
