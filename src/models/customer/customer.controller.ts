import {
    Body,
    Controller,
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
import { CustomerJwtStrategyGuard } from '../../auth/guard/customer-jwt.guard';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';
import { GetCustomerListDto } from '../custom-field/dto/get-customer-list.dto';
import { StoreService } from '../store/store.service';
import { CustomerService } from './customer.service';
import { CustomerCreateDto } from './dto/create-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerCreateParamDto } from './dto/create-customer-param.dto';

@Controller()
export class CustomerController {
    constructor(
        private customerService: CustomerService,
        private storeService: StoreService,
    ) {}

    @Post('/stores/:id/customers')
    async CreateCustomer(@Param() customerCreateParamData: CustomerCreateParamDto, @Body() customerCreateData: CustomerCreateDto) {
        try {
            const storeDoesExist = await this.storeService.doesExistById(customerCreateParamData.id);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExist(customerCreateParamData.id, customerCreateData.email);
            if (customerDoesExist) {
                throw new HttpException('ERR_CUSTOMER_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }
            
            const customer = await this.customerService.createItem({ ...customerCreateParamData, ...customerCreateData });
            
            return { id: customer._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/customers')
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

    @UseGuards(CustomerJwtStrategyGuard)
    @Get('/customers/me')
    async GetCustomer(@Request() req) {
        try {
            const { id, store } = req.user;

            const doesExist = await this.storeService.getItemById(store);
            if (!doesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const customer = await this.customerService.getItemById(id);
            if (!customer) {
                throw new HttpException('ERR_CUSTOMER_NOT_FOUND', HttpStatus.NOT_FOUND);
            }
            return customer;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Patch('/customers/me')
    async UpdateCustomer(@Body() updateCustomerData: UpdateCustomerDto, @Request() req) {
        try {
            const { id, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExist(store, updateCustomerData.email);
            if (customerDoesExist) {
                throw new HttpException('ERR_CUSTOMER_ALREADY_EXISTS', HttpStatus.CONFLICT);
            }

            const result = await this.customerService.updateItem(id, updateCustomerData);
            if (!result) {
                throw new HttpException('ERR_CUSTOMER_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            return;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Patch('/customers/me/password')
    async UpdateCustomerPassword(@Body() updateCustomerPasswordData: UpdateCustomerPasswordDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const isDuplicated = updateCustomerPasswordData.oldPassword === updateCustomerPasswordData.newPassword;
            if (isDuplicated) {
                throw new HttpException('ERR_DUPLICATED_PARAM', HttpStatus.CONFLICT);
            }

            const isCertified = await this.customerService.comparePassword(store, updateCustomerPasswordData);
            if (!isCertified) {
                throw new HttpException('ERR_INVALID_ACCESS', HttpStatus.FORBIDDEN);
            }

            const result = await this.customerService.updateItemPasssword(store, updateCustomerPasswordData);
            if (!result) {
                throw new HttpException('ERR_CUSTOMER_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            return;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
