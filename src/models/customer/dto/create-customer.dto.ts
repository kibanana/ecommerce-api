import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, ValidateNested } from 'class-validator';
import { CustomField } from 'src/models/common/custom-field.dto';

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CustomField)
    readonly customFields: CustomField[];

    constructor(name: string, email: string, password: string, customFields: CustomField[]) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.customFields = customFields;
    }
}