import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetStoreListDto {
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    readonly offset: number;
    
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    readonly limit: number;

    constructor(offset: number, limit: number) {
        this.offset = offset;
        this.limit = limit;
    }
}
