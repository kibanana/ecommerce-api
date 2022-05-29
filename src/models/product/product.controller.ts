import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
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
}
