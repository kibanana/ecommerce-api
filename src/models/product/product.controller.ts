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
import { StoreService } from '../store/store.service';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { StoreJwtStrategyGuard } from '../../auth/guard/store-jwt.guard';
import { GetProductListParamDto } from './dto/get-product-list-param.dto';
import { GetMyProductItemDto } from './dto/get-my-product-item.dto';
import { GetProductItemDto } from './dto/get-product-item.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductParamDto } from './dto/update-product-param.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { ErrorCode } from '../../common/constants/errorCode';
import { CustomFieldService } from '../custom-field/custom-field.service';
import { type } from 'os';
import { CustomFieldTarget, CustomFieldType } from '../custom-field/custom-field.constants';

@Controller()
export class ProductController {
    constructor(
        private productService: ProductService,
        private storeService: StoreService,
        private customFieldService: CustomFieldService,
    ) {}

    @UseGuards(StoreJwtStrategyGuard)
    @Post('/stores/me/products')
    async CreateProduct(@Body() createProductData: CreateProductDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (createProductData.customFields) {
                const customFieldValues = createProductData.customFields
                const customFields = await this.customFieldService.getList(store, { target: CustomFieldTarget.PRODUCT });
    
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

            const product = await this.productService.createItem(store, createProductData);
            
            return { id: product._id };
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/products')
    async GetMyProductList(@Query() getProductListData: GetProductListDto, @Request() req) {
        try {
            const { id: store } = req.user;
            let { offset, limit } = getProductListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const data = await this.productService.getList(store, { offset, limit } as GetProductListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/stores/:id/products')
    async GetProductList(@Param() productListParamData: GetProductListParamDto, @Query() getProductListData: GetProductListDto) {
        try {
            const { id: store } = productListParamData;
            let { offset, limit } = getProductListData;

            offset = isNaN(offset) ? 0 : offset;
            limit = isNaN(limit) ? 15 : limit;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const data = await this.productService.getList(store, { offset, limit } as GetProductListDto);
            return data;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Get('/stores/me/products/:id')
    async GetMyProduct(@Param() getMyProductItemData: GetMyProductItemDto, @Request() req) {
        try {
            const { id: store } = req.user;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const product = await this.productService.getItemByStore(store, getMyProductItemData);
            if (!product) {
                throw new HttpException(ErrorCode.ERR_PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            return product;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/stores/:storeid/products/:id')
    async GetProduct(@Param() getProductItemData: GetProductItemDto, @Request() req) {
        try {
            const storeDoesExist = await this.storeService.doesExistById(getProductItemData.storeid);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const product = await this.productService.getItem(getProductItemData);
            if (!product) {
                throw new HttpException(ErrorCode.ERR_PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            return product;
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Patch('/stores/me/products/:id')
    async UpdateProduct(@Param() updateProductParamData: UpdateProductParamDto, @Body() updateProductData: UpdateProductDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { id } = updateProductParamData;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            if (updateProductData.customFields) {
                const customFieldValues = updateProductData.customFields;
                const customFields = await this.customFieldService.getList(store, { target: CustomFieldTarget.PRODUCT });
    
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

            const result = await this.productService.updateItem(id, updateProductData);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(StoreJwtStrategyGuard)
    @Delete('/stores/me/products/:id')
    async DeleteProduct(@Param() deleteProductParamData: DeleteProductDto, @Request() req) {
        try {
            const { id: store } = req.user;
            const { id } = deleteProductParamData;

            const storeDoesExist = await this.storeService.doesExistById(store);
            if (!storeDoesExist) {
                throw new HttpException(ErrorCode.ERR_STORE_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const result = await this.productService.deleteItem(id);
            if (!result) {
                throw new HttpException(ErrorCode.ERR_PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
            }
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new HttpException(ErrorCode.ERR_INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
