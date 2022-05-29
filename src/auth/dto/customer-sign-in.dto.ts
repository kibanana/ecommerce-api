import { IsNotEmpty, IsMongoId, IsString, IsIn } from 'class-validator';

export class CustomerSignInDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}