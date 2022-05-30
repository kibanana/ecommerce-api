import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCustomFieldListQueryDto } from './dto/get-custom-filed-list-query.dto';
import { CustomField, CustomFieldDocument } from './schema/custom-field.schema';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { CustomFieldDto } from '../common/custom-field.dto';
import { CustomFieldType } from './custom-field.constants';

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

    getListByIds(ids: string[], store: string) {
        return this.customFieldModel.find({ _id: { $in: ids }, store });
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

    async validate(store: string, target: string, customFieldValues: CustomFieldDto[], isNotFromStore: boolean = false) {
        const customFields = await this.getList(store, { target });

        const customFieldMap = new Map();
        for (let i = 0; i < customFieldValues.length; i++) {
            customFieldMap.set(customFieldValues[i].customField, customFieldValues[i]);
        }

        for (let i = 0; i < customFields.length; i++) {
            const customField = customFields[i];
            const customFieldValue = customFieldMap.get(String(customField._id));

            if (!customFieldValue && customField.isRequired === true) {
                return false;
            }
            else if (!customFieldValue) continue;

            if (
                customField.name !== customFieldValue.name ||
                (customField.isOnlyStoreWritable === true && isNotFromStore) || // customer가 store만 수정할 수 있는 필드를 수정하려고 할 때
                (
                    customField.type === CustomFieldType.INPUT &&
                    typeof customFieldValue.value !== 'string'
                ) ||
                (
                    customField.type === CustomFieldType.SELECT &&
                    !Array.isArray(customFieldValue.value)
                )
            ) {
                return false;
            }

            if (customField.type === CustomFieldType.SELECT) {
                for (let j = 0; j < customFieldValue.value; j++) {
                    if (customField.subType.indexOf(customFieldValue.value[j]) === -1) {
                        return false;
                    }
                }
            }
        }

        return true;
    }
}
