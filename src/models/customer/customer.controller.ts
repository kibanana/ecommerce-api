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
import { CustomerJwtStrategyGuard } from '../../auth/guard/customer-jwt.guard';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';
import { GetCustomerListDto } from './dto/get-customer-list.dto';
import { StoreService } from '../store/store.service';
import { CustomerService } from './customer.service';
import { CreateCustomerParamDto } from './dto/create-customer-param.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ErrorCode } from '../../common/constants/errorCode';

@Controller()
export class CustomerController {
    constructor(
        private customerService: CustomerService,
        private storeService: StoreService,
    ) {}

    @Post('/stores/:id/customers')
    async CreateCustomer(@Param() createCustomerParamData: CreateCustomerParamDto, @Body() createCustomerData: CreateCustomerDto) {
        try {
            const { id: store } = createCustomerParamData

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExist(store, createCustomerData.email);
            if (customerDoesExist) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_ALREADY_EXISTS, HttpStatus.CONFLICT);
            }

            // TODO custom fields
            
            const customer = await this.customerService.createItem(store, createCustomerData);
            
            return { id: customer._id };
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/customers')
    async GetMyCustomerList(@Query() customerListData: GetCustomerListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            let { offset, limit } = customerListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const data = await this.customerService.getList(store, { offset, limit } as GetCustomerListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Get('/customers/me')
    async GetCustomer(@Request() req) {
        try {
            const { id, store } = req.user;

            const storeDoesExist = await this.storeService.getItemById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customer = await this.customerService.getItemById(id, store);
            if (!customer) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            return customer;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Patch('/customers/me')
    async UpdateCustomer(@Body() updateCustomerData: UpdateCustomerDto, @Request() req) {
        try {
            const { id, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExist(store, updateCustomerData.email);
            if (customerDoesExist) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_ALREADY_EXISTS, HttpStatus.CONFLICT);
            }

            // TODO custom fields

            const result = await this.customerService.updateItem(id, updateCustomerData);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Patch('/customers/me/password')
    async UpdateCustomerPassword(@Body() updateCustomerPasswordData: UpdateCustomerPasswordDto, @Request() req) {
        try {
            const { id, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const isDuplicated = updateCustomerPasswordData.oldPassword === updateCustomerPasswordData.newPassword;
            if (isDuplicated) {
                throw new HttpException(ErrorCode.ERR_DUPLICATED_PARAM, HttpStatus.BAD_REQUEST);
            }

            const isCertified = await this.customerService.comparePassword(id, updateCustomerPasswordData);
            if (!isCertified) {
                throw new HttpException(ErrorCode.ERR_INVALID_ACCESS, HttpStatus.FORBIDDEN);
            }

            const result = await this.customerService.updateItemPasssword(id, updateCustomerPasswordData);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Delete('/customers/me')
    async DeleteCustomer(@Request() req) {
        try {
            const { id, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const result = await this.customerService.deleteItem(id);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
