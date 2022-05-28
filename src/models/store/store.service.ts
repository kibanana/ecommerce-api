import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreCreateDto } from './dto/store-create.dto';
import { Store, StoreDocument } from './schema/store.schema';
import { StoreListDto } from './dto/store-list.dto';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) private storeModel: Model<StoreDocument>,
    ) {}

    createItem({ name, email, password }: StoreCreateDto) {
        const store = new this.storeModel({ name, email, password });
        return store.save();
    }

    getList({ offset, limit }: StoreListDto) {
        return this.storeModel.find(
            {},
            '-password',
            { skip: offset * limit, limit }
        );
    }

    getItemById(id: string) {
        return this.storeModel.findById(id);
    }

    getItem(email: string) {
        return this.storeModel.findOne({ email });
    }

    async doesExistByName(name: string) {
        return (await this.storeModel.countDocuments({ name })) > 0;
    }

    async doesExistByEmail(email: string) {
        return (await this.storeModel.countDocuments({ email })) > 0;
    }
}
