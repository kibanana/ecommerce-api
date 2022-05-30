import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { CustomField } from './custom-field.dto';

export class UpdateProductDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @IsString({ each: true })
    readonly categories: string[];

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CustomField)
    readonly customFields: CustomField[];

    // TODO customfields

    constructor(name: string, price: number, categories: string[], customFields: CustomField[]) {
        this.name = name;
        this.price = price;
        this.categories = categories;
        this.customFields = customFields;
    }
}