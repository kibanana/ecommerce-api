import { IsNotEmpty, IsMongoId, IsString, IsIn } from 'class-validator';
import { CustomFieldTarget } from '../custom-field.constants';

export class GetCustomFieldListDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
}