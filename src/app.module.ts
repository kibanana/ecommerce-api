import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomFieldModule } from './models/custom-field/custom-field.module';
import { CustomerModule } from './models/customer/customer.module';
import { OrderModule } from './models/order/order.module';
import { ProductModule } from './models/product/product.module';
import { StoreModule } from './models/store/store.module';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env' }),
        MongooseModule.forRoot(process.env.DB_URL),
        StoreModule,
        ProductModule,
        OrderModule,
        CustomFieldModule,
        CustomerModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
