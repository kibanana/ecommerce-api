import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateCustomerDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
    
    // TODO customfields

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}