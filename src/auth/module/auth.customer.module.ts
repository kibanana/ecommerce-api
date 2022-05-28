import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService  } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Customer, CustomerSchema } from '../../models/customer/schema/customer.schema';
import { CustomerModule } from '../../models/customer/customer.module';
import { AuthCustomerController } from '../controller/auth.customer.controller';
import { AuthCustomerService } from '../service/auth.customer.service';
import { CustomerJwtStrategy } from '../strategy/customer-jwt.strategy';
import { CustomerLocalStrategy } from '../strategy/customer-local.strategy';

@Module({
	imports: [
		ConfigModule,
        PassportModule,
		JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_CUSTOMER_SECRET'),
                    signOptions: { expiresIn: configService.get<string>('JWT_CUSTOMER_EXPIRES_IN') },
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),
        CustomerModule,
	],
	controllers: [AuthCustomerController],
	providers: [
        AuthCustomerService,
        CustomerLocalStrategy,
        CustomerJwtStrategy,
    ],
    exports: [AuthCustomerService],
})
export class AuthCustomerModule {}
