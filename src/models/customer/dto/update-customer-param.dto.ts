import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCustomerParamDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
