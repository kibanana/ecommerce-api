import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { CustomerCustomFieldTarget } from '../custom-field.constants';

export class GetCustomFieldListQueryDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(CustomerCustomFieldTarget)
    readonly target: string;
    
    constructor(target: string) {
        this.target = target;
    }
}
