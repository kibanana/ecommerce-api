import { IsString, IsNotEmpty, IsIn, IsBoolean, IsOptional } from 'class-validator';
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

    @IsOptional()
    @IsString({ each: true })
    readonly subType: string[];

    @IsNotEmpty()
    @IsBoolean()
    readonly isRequired: boolean;

    @IsOptional()
    @IsBoolean()
    readonly isOnlyStoreWritable: boolean;

    constructor(target: string, name: string, type: string, subType: string[], isRequired: boolean, isOnlyStoreWritable: boolean) {
        this.target = target;
        this.name = name;
        this.type = type;
        this.subType = subType;
        this.isRequired = isRequired;
        this.isOnlyStoreWritable = isOnlyStoreWritable;
    }
}