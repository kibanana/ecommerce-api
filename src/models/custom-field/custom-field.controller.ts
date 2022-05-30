import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
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
import { CustomFieldType } from './custom-field.constants';
import { UpdateCustomFieldParamDto } from './dto/update-custom-field-param.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { DeleteCustomFieldParamDto } from './dto/delete-custom-field-param.dto';

@Controller()
export class CustomFieldController {
    constructor(
        private customFieldService: CustomFieldService,
        private storeService: StoreService,
    ) {}
    
    @UseGuards(StoreJwtStrategyGuard)
    @Post('/stores/me/custom-fields')
    async CreateCustomField(@Body() createCustomFieldData: CreateCustomFieldDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { type, subType } = createCustomFieldData;

            if (
                type === CustomFieldType.INPUT && subType ||
                (
                    type === CustomFieldType.SELECT &&
                    (
                        !Array.isArray(subType) ||
                        subType.length <= 0 ||
                        typeof subType[0] !== 'string'
                    )
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
            if (err instanceof HttpException) throw err;
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

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/stores/me/custom-fields/:id')
    async UpdateCustomField(@Param() updateCustomFieldParamData: UpdateCustomFieldParamDto, @Body() updateCustomFieldData: UpdateCustomFieldDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { id } = updateCustomFieldParamData;
            const { type, subType } = updateCustomFieldData;

            if (
                type === CustomFieldType.INPUT && subType ||
                (
                    type === CustomFieldType.SELECT &&
                    (
                        !Array.isArray(subType) ||
                        subType.length <= 0 ||
                        typeof subType[0] !== 'string'
                    )
                )
            ) {
                throw new HttpException(ErrorCode.ERR_INVALID_PARAM, HttpStatus.BAD_REQUEST);
            }

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const result = await this.customFieldService.updateItem(id, updateCustomFieldData);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_CUSTOM_FIELD_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Delete('/stores/me/custom-fields/:id')
    async DeleteCustomField(@Param() deleteCustomFieldParamData: DeleteCustomFieldParamDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { id } = deleteCustomFieldParamData;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const result = await this.customFieldService.deleteItem(id);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_CUSTOM_FIELD_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

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
}
