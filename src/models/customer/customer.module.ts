import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer, CustomerSchema } from './schema/customer.schema';

@Module({
    imports: [
      MongooseModule.forFeatureAsync([
        {
            name: Customer.name,
            useFactory: () => {
                const schema = CustomerSchema;
                schema.pre('save', async function () {
                    const customer = this;
                    const hashedPassword = await bcrypt.hash(customer.password, (await bcrypt.genSalt()));
                    customer.password = hashedPassword
                });
                return schema;
            },
        },
      ]),
    ],
    providers: [CustomerService],
    controllers: [CustomerController]
})
export class CustomerModule {}
