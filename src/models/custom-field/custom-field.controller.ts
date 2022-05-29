import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CustomFieldService } from './custom-field.service';
import { GetCustomFieldListDto } from './dto/get-custom-field-list.dto';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';
import { CustomerJwtStrategyGuard } from '../../auth/guard/customer-jwt.guard';

@Controller()
export class CustomFieldController {
    constructor(
        private customFieldService: CustomFieldService,
        private storeService: StoreService,
    ) {}

    @Get('/stores/:id/customers/custom-fields')
    async GetCustomerCustomFieldList(@Param() getCustomFieldListData: GetCustomFieldListDto) {
        try {
            const { id: store } = getCustomFieldListData;

            const doesExist = await this.storeService.doesExistById(store);
            if (!doesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            
            const customFields = await this.customFieldService.getCustomerList(store);
            return customFields;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Get('/stores/:id/orders/custom-fields')
    async GetOrderCustomFieldList(@Param() getCustomFieldListData: GetCustomFieldListDto) {
        try {
            const { id: store } = getCustomFieldListData;

            const doesExist = await this.storeService.doesExistById(store);
            if (!doesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            
            const customFields = await this.customFieldService.getOrderList(store);
            return customFields;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/products/custom-fields')
    async GetMyProductCustomFieldList(@Request() req) {
        try {
            const { id: store } = req.user;

            const doesExist = await this.storeService.doesExistById(store);
            if (!doesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            
            const customFields = await this.customFieldService.getProductList(store);
            return customFields;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
