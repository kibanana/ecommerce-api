import { IsNotEmpty, IsMongoId } from 'class-validator';

export class GetProductItemDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly storeid: string;

    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(storeid: string, id: string) {
        this.storeid = storeid;
        this.id = id;
    }
}