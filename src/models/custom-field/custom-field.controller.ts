import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CustomFieldService } from './custom-field.service';
import { GetCustomFieldListDto } from './dto/get-custom-field-list.dto';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';
import { ErrorCode } from '../../common/constants/errorCode';
import { GetMyCustomFieldListQueryDto } from './dto/get-my-custom-filed-list-query.dto';
import { GetCustomFieldListQueryDto } from './dto/get-custom-filed-list-query.dto';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { CustomFieldType, CustomFieldSubType } from './custom-field.constants';

@Controller()
export class CustomFieldController {
    constructor(
        private customFieldService: CustomFieldService,
        private storeService: StoreService,
    ) {}

    @Get('/stores/:id/custom-fields')
    async GetCustomFieldList(@Query() getCustomFieldListQueryData: GetCustomFieldListQueryDto, @Param() getCustomFieldListData: GetCustomFieldListDto) {
        try {
            const { id: store } = getCustomFieldListData;

            const doesExist = await this.storeService.doesExistById(store);
            if (!doesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            
            const customFields = await this.customFieldService.getList(store, getCustomFieldListQueryData);
            return customFields;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Post('/stores/me/custom-fields')
    async CreateProduct(@Body() createCustomFieldData: CreateCustomFieldDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { type, subType } = createCustomFieldData;

            if (
                (
                    type === CustomFieldType.SELECT &&
                    (
                        !Array.isArray(subType) ||
                        subType.length <= 0 ||
                        typeof subType[0] !== 'string'
                    )
                )
                ||
                (
                    type === CustomFieldType.INPUT &&
                    !Object.values(CustomFieldSubType).includes(subType)
                )
            ) {
                throw new HttpException(ErrorCode.ERR_INVALID_PARAM, HttpStatus.BAD_REQUEST);
            }

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customField = await this.customFieldService.createItem(store, createCustomFieldData);
            
            return { id: customField._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/custom-fields')
    async GetMyCustomFieldList(@Query() getMyCustomFieldListQueryData: GetMyCustomFieldListQueryDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const doesExist = await this.storeService.doesExistById(store);
            if (!doesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            
            const customFields = await this.customFieldService.getList(store, getMyCustomFieldListQueryData);
            return customFields;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
