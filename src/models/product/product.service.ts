import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}

    createItem(store, { name, price, categories, customFields }: CreateProductDto) {
        const product = new this.productModel({ store, name, price, categories, customFields });
        return product.save();
    }

    getList(store, { offset, limit }: GetProductListDto) {
        return this.productModel.find(
            { store },
            {},
            { skip: offset * limit, limit }
        );
    }
}
