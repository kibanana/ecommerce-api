import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class StoreUpdateDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    constructor(name: string, email: string) {
        this.name = name;
        this.email = email;
    }
}