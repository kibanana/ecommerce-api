import { Module } from '@nestjs/common';
import { AuthCustomerModule } from './module/auth.customer.module';
import { AuthStoreModule } from './module/auth.store.module';

@Module({
	imports: [
        AuthCustomerModule,
        AuthStoreModule,
    ]
})
export class AuthModule {}
