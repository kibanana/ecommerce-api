import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional } from 'class-validator';

export class CustomField {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly type: string;

    @IsNotEmpty()
    readonly value: any;
}