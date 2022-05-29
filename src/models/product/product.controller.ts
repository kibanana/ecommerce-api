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
import { StoreService } from '../store/store.service';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';

@Controller()
export class ProductController {
    constructor(
        private productService: ProductService,
        private storeService: StoreService,
    ) {}

    @UseGuards(StoreJwtStrategyGuard)
    @Post('/stores/me/products')
    async CreateProduct(@Body() createProductData: CreateProductDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException('ERR_STORE_NOT_FOUND', HttpStatus.NOT_FOUND);
            }

            const product = await this.productService.createItem(store, createProductData);
            
            return { id: product._id };
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/products')
    async GetProductList(@Query() productListData: GetProductListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            let { offset, limit } = productListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const products = await this.productService.getList(store, { offset, limit } as GetProductListDto);
            return products;
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
