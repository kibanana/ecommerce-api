import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { CustomFieldDto } from 'src/models/common/custom-field.dto';

export class UpdateCustomerDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CustomFieldDto)
    readonly customFields: CustomFieldDto[];
    
    constructor(name: string, email: string, customFields: CustomFieldDto[]) {
        this.name = name;
        this.email = email;
        this.customFields = customFields;
    }
}