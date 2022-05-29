import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateStorePasswordDto {
    @IsNotEmpty()
    @IsString()
    readonly oldPassword: string;

    @IsNotEmpty()
    @IsString()
    readonly newPassword: string;

    constructor(oldPassword: string, newPassword: string) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }
}