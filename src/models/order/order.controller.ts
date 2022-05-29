import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
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

@Controller('orders')
export class OrderController {
    constructor(
        private orderService: OrderService,
        private storeService: StoreService,
        private customerService: CustomerService,
        private productService: ProductService,
    ) {}

    @UseGuards(CustomerJwtStrategyGuard)
    @Post()
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

            const order = await this.orderService.createItem(store, customer, createOrderData);

            return { id: order._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
