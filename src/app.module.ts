import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './models/customer/customer.module';
import { StoreModule } from './models/store/store.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/ecommerce'),
        StoreModule,
        CustomerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
