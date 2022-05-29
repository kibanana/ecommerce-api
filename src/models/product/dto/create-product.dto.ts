import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional } from 'class-validator';
import { CustomField } from './custom-field.dto';

export class CreateProductDto {
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

    constructor(name: string, price: number, categories: string[], customFields: CustomField[]) {
        console.log(name, price, categories)
        this.name = name;
        this.price = price;
        this.categories = categories;
        this.customFields = customFields;
    }
}