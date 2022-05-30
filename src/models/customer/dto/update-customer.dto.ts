import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { CustomField } from 'src/models/common/custom-field.dto';

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
    @Type(() => CustomField)
    readonly customFields: CustomField[];
    
    constructor(name: string, email: string, customFields: CustomField[]) {
        this.name = name;
        this.email = email;
        this.customFields = customFields;
    }
}