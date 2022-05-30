import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { CustomFieldTarget } from '../custom-field.constants';

export class GetMyCustomFieldListQueryDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(Object.values(CustomFieldTarget))
    readonly target: string;
    
    constructor(target: string) {
        this.target = target;
    }
}
