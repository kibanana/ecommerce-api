import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional, IsMongoId } from 'class-validator';

export class CustomField {
    @IsNotEmpty()
    @IsMongoId()
    readonly customField: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly type: string;

    @IsNotEmpty()
    readonly value: any;
}