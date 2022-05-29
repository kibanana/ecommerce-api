import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CustomerCreateParamDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}