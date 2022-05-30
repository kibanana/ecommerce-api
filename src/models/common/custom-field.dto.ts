import { IsString, IsNotEmpty, IsMongoId, IsBoolean, IsOptional } from 'class-validator';

export class CustomFieldDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly customField: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly type: string;

    @IsNotEmpty()
    readonly value: any;
}