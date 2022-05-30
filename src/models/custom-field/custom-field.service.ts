import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCustomFieldListQueryDto } from './dto/get-custom-filed-list-query.dto';
import { CustomField, CustomFieldDocument } from './schema/custom-field.schema';
import { CustomFieldTarget } from './custom-field.constants';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

@Injectable()
export class CustomFieldService {
    constructor(
        @InjectModel(CustomField.name) private customFieldModel: Model<CustomFieldDocument>,
    ) {}

    createItem(store: string, { target, name, type, subType, isRequired, isOnlyStoreWritable }: CreateCustomFieldDto) {
        return this.customFieldModel.create({ store, target, name, type, subType, isRequired, isOnlyStoreWritable });
    }

    getList(store: string, { target }: GetCustomFieldListQueryDto) {
        return this.customFieldModel.find({ store, target });
    }
    
    getCustomerList(store: string) {
        return this.customFieldModel.find({
            store,
            target: CustomFieldTarget.CUSTOMER,
        });
    }

    getOrderList(store: string) {
        return this.customFieldModel.find({
            store,
            target: CustomFieldTarget.ORDER,
        });
    }

    getProductList(store: string) {
        return this.customFieldModel.find({
            store,
            target: CustomFieldTarget.PRODUCT,
        });
    }

    updateItem(id: string, { name, type, subType, isRequired, isOnlyStoreWritable }: UpdateCustomFieldDto) {
        return this.customFieldModel.findByIdAndUpdate(
            id,
            { name, type, subType, isRequired, isOnlyStoreWritable }
        );
    }

    deleteItem(id: string) {
        return this.customFieldModel.findByIdAndDelete(id);
    }
}
