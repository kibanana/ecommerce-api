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

    constructor(store: string, name: string, email: string, password: string) {
        this.store = store;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}