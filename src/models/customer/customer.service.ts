import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetCustomerListDto } from '../custom-field/dto/get-customer-list.dto';
import { CustomerCreateDto } from './dto/create-customer.dto';
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

    getList(store: string, { offset, limit }: GetCustomerListDto) {
        return this.customerModel.find(
            { store },
            '-store -password',
            { skip: offset * limit, limit }
        );
    }
    
    getItemById(id: string) {
        return this.customerModel.findById(id);
    }

    getItem(email: string) {
        return this.customerModel.findOne({ email });
    }

    async doesExist(store: string, email: string) {
        return (await this.customerModel.countDocuments({ store, email })) > 0;
    }
}
