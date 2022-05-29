import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { StoreModule } from '../store/store.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
		StoreModule,
		CustomerModule,
		ProductModule,
	],
	controllers: [OrderController],
	providers: [OrderService]
})
export class OrderModule {}
