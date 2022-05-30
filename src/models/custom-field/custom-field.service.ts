import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetMyCustomFieldListQueryDto } from './dto/get-my-custom-filed-list-query.dto';
import { CustomField, CustomFieldDocument } from './schema/custom-field.schema';
import { CustomFieldTarget } from './custom-field.constants';

@Injectable()
export class CustomFieldService {
    constructor(
        @InjectModel(CustomField.name) private customFieldModel: Model<CustomFieldDocument>,
    ) {}

    getList(store: string, { target }: GetMyCustomFieldListQueryDto) {
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
}
