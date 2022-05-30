import { IsString, IsNotEmpty, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { CustomFieldTarget, CustomFieldType } from '../custom-field.constants';

export class UpdateCustomFieldDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(Object.values(CustomFieldType))
    readonly type: string;

    @IsOptional()
    @IsString({ each: true })
    readonly subType: string[];

    @IsNotEmpty()
    @IsBoolean()
    readonly isRequired: boolean;

    @IsOptional()
    @IsBoolean()
    readonly isOnlyStoreWritable: boolean;

    constructor(name: string, type: string, subType: string[], isRequired: boolean, isOnlyStoreWritable: boolean) {
        this.name = name;
        this.type = type;
        this.subType = subType;
        this.isRequired = isRequired;
        this.isOnlyStoreWritable = isOnlyStoreWritable;
    }
}