import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { GetMyProductItemDto } from './dto/get-my-product-item.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}

    createItem(store: string, { name, price, categories, customFields }: CreateProductDto) {
        const product = new this.productModel({ store, name, price, categories, customFields });
        return product.save();
    }

    getList(store: string, { offset, limit }: GetProductListDto) {
        return this.productModel.find(
            { store },
            { customFields: false },
            { skip: offset * limit, limit }
        );
    }

    getItem({ id }: GetMyProductItemDto) {
        return this.productModel.findById(id);
    }

    updateItem(id: string, { name, price, categories, customFields }: UpdateProductDto) {
        return this.productModel.findByIdAndUpdate(
            id,
            { name, price, categories, customFields }
        );
    }
}
