import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomFieldModule } from './models/custom-field/custom-field.module';
import { CustomerModule } from './models/customer/customer.module';
import { OrderModule } from './models/order/order.module';
import { ProductModule } from './models/product/product.module';
import { StoreModule } from './models/store/store.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/ecommerce'),
        StoreModule,
        ProductModule,
        OrderModule,
        CustomFieldModule,
        CustomerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
