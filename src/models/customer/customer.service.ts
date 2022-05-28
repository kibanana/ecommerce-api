import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerCreateDto } from './dto/customer-create.dto';
import { Customer, CustomerDocument } from './schema/customer.schema';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    ) {}

    createItem({ store, name, email, password }: CustomerCreateDto) {
        const customer = new this.customerModel({ store, name, email, password });
        return customer.save();
    }
    
    getItemById(id: string) {
        return this.customerModel.findById(id);
    }

    getItem(email: string) {
        return this.customerModel.findOne({ email });
    }
}
