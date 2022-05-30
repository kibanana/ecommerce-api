import { IsMongoId, IsNotEmpty } from 'class-validator';

export class GetCustomerParamDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}
