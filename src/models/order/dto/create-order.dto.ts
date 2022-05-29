import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, ValidateNested, IsOptional, IsMongoId } from 'class-validator';
import { CustomField } from '../../product/dto/custom-field.dto';

export class CreateOrderDto {
    @IsMongoId({ each: true })
    readonly products: string[];

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CustomField)
    readonly customFields: CustomField[];

    constructor(products: string[], price: number, customFields: CustomField[]) {
        this.products = products;
        this.price = price;
        this.customFields = customFields;
    }
}