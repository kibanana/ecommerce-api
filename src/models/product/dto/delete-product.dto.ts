import { IsNotEmpty, IsMongoId } from 'class-validator';

export class DeleteProductDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}