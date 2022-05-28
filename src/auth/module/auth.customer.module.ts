import { Module } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthCustomerController } from '../controller/auth.customer.controller';

@Module({
	providers: [AuthService],
	controllers: [AuthCustomerController]
})
export class AuthCustomerModule {}
