import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested, IsOptional, IsMongoId, Min, ArrayMinSize } from 'class-validator';
import { CustomFieldDto } from '../../common/custom-field.dto';

export class CreateOrderDto {
    @IsMongoId({ each: true })
    @ArrayMinSize(1)
    readonly products: string[];

    @IsNotEmpty()
    @IsNumber()
    @Min(99)
    readonly price: number;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CustomFieldDto)
    readonly customFields: CustomFieldDto[];

    constructor(products: string[], price: number, customFields: CustomFieldDto[]) {
        this.products = products;
        this.price = price;
        this.customFields = customFields;
    }
}