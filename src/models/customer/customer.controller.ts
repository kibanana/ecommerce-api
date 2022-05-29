import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { StoreJwtStrategyGuard } from 'src/auth/guard/store-jwt.guard';
import { GetCustomerListDto } from '../custom-field/dto/get-customer-list.dto';
import { StoreService } from '../store/store.service';
import { CustomerService } from './customer.service';
import { CustomerCreateDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
    constructor(
        private customerService: CustomerService,
        private storeService: StoreService,
    ) {}

    @Post()
    async CreateCustomer(@Body() customerCreateData: CustomerCreateDto) {
        try {
            const store = await this.storeService.getItemById(customerCreateData.store);
            if (!store) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const doesExist = await this.customerService.doesExist(customerCreateData.store, customerCreateData.email);
            if (doesExist) {
                throw new HttpException('ERR_CUSTOMER_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }
            
            const customer = await this.customerService.createItem(customerCreateData);
            
            return { id: customer._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get()
    async GetCustomerList(@Query() customerListData: GetCustomerListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            let { offset, limit } = customerListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const customers = await this.customerService.getList(store, { offset, limit } as GetCustomerListDto);
            return customers;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
