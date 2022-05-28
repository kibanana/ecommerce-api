import { IsString, IsNotEmpty, IsEmail, IsMongoId } from 'class-validator';

export class CustomerCreateDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly store: string;

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

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}