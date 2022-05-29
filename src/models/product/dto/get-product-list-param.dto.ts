import { IsNotEmpty, IsMongoId } from 'class-validator';

export class GetProductListParamDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}