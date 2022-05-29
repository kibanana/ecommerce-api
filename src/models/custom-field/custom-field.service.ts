import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCustomFieldListDto } from './dto/get-custom-field-list.dto';
import { CustomField, CustomFieldDocument } from './schema/custom-field.schema';
import { CustomFieldTarget } from './custom-field.constants';

@Injectable()
export class CustomFieldService {
    constructor(
        @InjectModel(CustomField.name) private customFieldModel: Model<CustomFieldDocument>,
    ) {}
    
    getCustomerList({ id: store }: GetCustomFieldListDto) {
        return this.customFieldModel.find({
            store,
            target: CustomFieldTarget.Customer
        });
    }
}
