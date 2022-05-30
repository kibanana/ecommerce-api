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
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { StoreService } from '../store/store.service';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/schema/product.schema';
import { StoreJwtStrategyGuard } from 'src/auth/guard/store-jwt.guard';
import { GetOrderListDto } from './dto/get-order-list.dto';
import { GetOrderItemDto } from './dto/get-order-item.dto';
import { GetCustomerOrderListDto } from './dto/get-customer-order-list.dto';
import { UpdateCustomerOrderDto } from './dto/update-customer-order.dto';
import { UpdateOrderParamDto } from './dto/update-order-param.dto';
import { UpdateStoreOrderDto } from './dto/update-store-order.dto';
import { ErrorCode } from '../../common/constants/errorCode';
import { CustomFieldTarget, CustomFieldType } from '../custom-field/custom-field.constants';
import { CustomFieldService } from '../custom-field/custom-field.service';

@Controller()
export class OrderController {
    constructor(
        private orderService: OrderService,
        private storeService: StoreService,
        private customerService: CustomerService,
        private productService: ProductService,
        private customFieldService: CustomFieldService,
    ) {}

    @UseGuards(CustomerJwtStrategyGuard)
    @Post('/orders')
    async CreateOrder(@Body() createOrderData: CreateOrderDto, @Request() req) {
        try {
            const { id: customer, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExistById(customer);
            if (!customerDoesExist) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const products = await this.productService.getListByIds(createOrderData.products, store);
            if (products.length !== createOrderData.products.length) {
                throw new HttpException(ErrorCode.ERR_PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            let price = 0;
            products.forEach(((product: Product) => price += product.price));
            if (price !== createOrderData.price) {
                throw new HttpException(ErrorCode.ERR_FORGERY_DATA, HttpStatus.CONFLICT);
            }

            if (createOrderData.customFields) {
                const customFieldValues = createOrderData.customFields
                const customFields = await this.customFieldService.getList(store, { target: CustomFieldTarget.ORDER });
    
                const customFieldMap = new Map();
                for (let i = 0; i < customFieldValues.length; i++) {
                    customFieldMap.set(customFieldValues[i].customField, customFieldValues[i]);
                }

                for (let i = 0; i < customFields.length; i++) {
                    const customField = customFields[i];
                    const customFieldValue = customFieldMap.get(String(customField._id));

                    if (!customFieldValue && customField.isRequired === true) {
                        throw new HttpException(ErrorCode.ERR_INVALID_PARAM, HttpStatus.BAD_REQUEST);
                    }
                    else if (!customFieldValue) continue;

                    if (
                        customField.name !== customFieldValue.name ||
                        (
                            customField.type === CustomFieldType.INPUT &&
                            typeof customFieldValue.value !== 'string'
                        ) ||
                        (
                            customField.type === CustomFieldType.SELECT &&
                            !Array.isArray(customFieldValue.value)
                        )
                    ) {
                        throw new HttpException(ErrorCode.ERR_INVALID_PARAM, HttpStatus.BAD_REQUEST);
                    }
    
                    if (customField.type === CustomFieldType.SELECT) {
                        customFieldValue.value.forEach((elem: string) => {
                            if (customField.subType.indexOf(elem) === -1) {
                                throw new HttpException(ErrorCode.ERR_INVALID_PARAM, HttpStatus.BAD_REQUEST);
                            }
                        });
                    }
                }
            }

            const order = await this.orderService.createItem(store, customer, createOrderData);

            return { id: order._id };
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/orders')
    async GetMyStoreOrderList(@Query() getOrderListData: GetOrderListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            let { offset, limit } = getOrderListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const data = await this.orderService.getList(store, { offset, limit } as GetOrderListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/orders/:id')
    async GetMyStoreOrderItem(@Param() getOrderItemData: GetOrderItemDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const order = await this.orderService.getItemByStore(store, getOrderItemData);
            if (!order) {
                throw new HttpException(ErrorCode.ERR_ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            return order;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/customers/:id/orders')
    async GetCustomerOrderList(@Param() getCustomerOrderListData: GetCustomerOrderListDto, @Query() getOrderListData: GetOrderListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { id } = getCustomerOrderListData;
            let { offset, limit } = getOrderListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customer = await this.customerService.getItemById(id, store);
            if (!customer) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const { list, count } = await this.orderService.getListByCustomer(store, id, { offset, limit } as GetOrderListDto);
            return { customer, list, count };
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Get('/customers/me/orders')
    async GetMyOrderList(@Query() getOrderListData: GetOrderListDto, @Request() req) {
        try {
            const { id: customer, store } = req.user;
            let { offset, limit } = getOrderListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExistById(customer);
            if (!customerDoesExist) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const data = await this.orderService.getListByCustomer(store, customer, { offset, limit } as GetOrderListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Get('/customers/me/orders/:id')
    async GetMyOrderItem(@Param() getOrderItemData: GetOrderItemDto, @Query() getOrderListData: GetOrderListDto, @Request() req) {
        try {
            const { id: customer, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExistById(customer);
            if (!customerDoesExist) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const order = await this.orderService.getItemByCustomer(customer, getOrderItemData);
            if (!order) {
                throw new HttpException(ErrorCode.ERR_ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
            
            return order;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(CustomerJwtStrategyGuard)
    @Patch('/customers/me/orders/:id/stauts')
    async UpdateCustomerOrder(@Param() updateOrderParamData: UpdateOrderParamDto, @Body() updateCustomerOrderDto: UpdateCustomerOrderDto, @Request() req) {
        try {
            const { id: customer, store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const customerDoesExist = await this.customerService.doesExistById(customer);
            if (!customerDoesExist) {
                throw new HttpException(ErrorCode.ERR_CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const result = await this.orderService.updateItem(updateOrderParamData.id, updateCustomerOrderDto.status);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/stores/me/orders/:id/stauts')
    async UpdateStoreOrder(@Param() updateOrderParamData: UpdateOrderParamDto, @Body() updateStoreOrderDto: UpdateStoreOrderDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const result = await this.orderService.updateItem(updateOrderParamData.id, updateStoreOrderDto.status);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_ORDER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
