import { IsString, IsNotEmpty, IsIn, IsBoolean } from 'class-validator';
import { CustomFieldTarget, CustomFieldType } from '../custom-field.constants';

export class CreateCustomFieldDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(Object.values(CustomFieldTarget))
    readonly target: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(Object.values(CustomFieldType))
    readonly type: string;

    @IsNotEmpty()
    readonly subType: any;

    @IsNotEmpty()
    @IsBoolean()
    readonly isRequired: boolean;

    @IsBoolean()
    readonly isOnlyStoreWritable: boolean;

    constructor(target: string, name: string, type: string, subType: string, isRequired: boolean, isOnlyStoreWritable: boolean) {
        this.target = target;
        this.name = name;
        this.type = type;
        this.subType = subType;
        this.isRequired = isRequired;
        this.isOnlyStoreWritable = isOnlyStoreWritable;
    }
}