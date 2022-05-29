import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { StoreModule } from '../store/store.module';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		StoreModule,
	],
	providers: [ProductService],
	controllers: [ProductController],
	exports: [ProductService],
})
export class ProductModule {}
