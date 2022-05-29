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
import { CustomerJwtStrategyGuard } from '../../auth/guard/customer-jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { StoreService } from '../store/store.service';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/schema/product.schema';
import { StoreJwtStrategyGuard } from 'src/auth/guard/store-jwt.guard';
import { GetOrderListDto } from './dto/get-order-list.dto';
import { GetMyOrderItemDto } from './dto/get-my-order-item.dto';

@Controller()
export class OrderController {
    constructor(
        private orderService: OrderService,
        private storeService: StoreService,
        private customerService: CustomerService,
        private productService: ProductService,
    ) {}

    @UseGuards(CustomerJwtStrategyGuard)
    @Post('/orders')
    async CreateOrder(@Body() createOrderData: CreateOrderDto, @Request() req) {
        try {
            const { id: customer, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExistById(customer);
            if (!customerDoesExist) {
                throw new HttpException('ERR_CUSTOMER_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const products = await this.productService.getListByIds(createOrderData.products, store);
            if (products.length !== createOrderData.products.length) {
                throw new HttpException('ERR_PRODUCT_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            let price = 0;
            products.forEach(((product: Product) => price += product.price));
            if (price !== createOrderData.price) {
                throw new HttpException('ERR_FORGERY_DATA', HttpStatus.CONFLICT);
            }

            // TODO custom fields

            const order = await this.orderService.createItem(store, customer, createOrderData);

            return { id: order._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/orders')
    async GetMyOrderList(@Query() getOrderListData: GetOrderListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            let { offset, limit } = getOrderListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const data = await this.orderService.getList(store, { offset, limit } as GetOrderListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/orders/:id')
    async GetMyOrder(@Param() getMyOrderItemData: GetMyOrderItemDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const order = await this.orderService.getItem(getMyOrderItemData);
            if (!order) {
                throw new HttpException('ERR_ORDER_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            return order;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
