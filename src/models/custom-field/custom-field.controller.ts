import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CustomFieldService } from './custom-field.service';
import { GetCustomFieldListDto } from './dto/get-custom-field-list.dto';

@Controller()
export class CustomFieldController {
    constructor(
        private customFieldService: CustomFieldService,
        private storeService: StoreService,
    ) {}

    @Get('/stores/:id/customers/custom-fields')
    async GetCustomerCustomFieldList(@Param() getCustomFieldListData: GetCustomFieldListDto) {
        try {
            const doesExist = await this.storeService.doesExistById(getCustomFieldListData.id);
            if (!doesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            
            const customFields = await this.customFieldService.getCustomerList(getCustomFieldListData);
            return customFields;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
