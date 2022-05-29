import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { GetCustomerListDto } from '../custom-field/dto/get-customer-list.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password.dto';
import { Customer, CustomerDocument } from './schema/customer.schema';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    ) {}

    createItem(store: string, { name, email, password }: CreateCustomerDto) {
        const customer = new this.customerModel({ store, name, email, password });
        return customer.save();
    }

    async getList(store: string, { offset, limit }: GetCustomerListDto) {
        const list = await this.customerModel.find(
            { store },
            { store: false, password: false, customFields: false },
            { skip: offset * limit, limit }
        );

        // TODO purchaseCount, productCount, amount

        const count = await this.customerModel.countDocuments({ store });

        return { list, count };
    }

    getItemById(id: string, store: string) {
        return this.customerModel.findOne({ id, store }, { password: false });
    }
    
    getItem(store: string, email: string) {
        return this.customerModel.findOne({ store, email });
    }

    async comparePassword(id: string, { oldPassword: password }: UpdateCustomerPasswordDto) {
        const customer = await this.customerModel.findById(id);

        if (customer && (await bcrypt.compare(password, customer.password))) return true;
        return false;
    }

    async doesExistById(id: string) {
        return !!(await this.customerModel.findById(id));
    }

    async doesExist(store: string, email: string) {
        return (await this.customerModel.countDocuments({ store, email })) > 0;
    }

    updateItem(id: string, { name, email }: UpdateCustomerDto) {
        return this.customerModel.findByIdAndUpdate(id, { name, email });
    }

    async updateItemPasssword(id: string, { newPassword: password }: UpdateCustomerPasswordDto) {
        const customer = await this.customerModel.findById(id);
        customer.password = password;
        return customer.save();
    }

    deleteItem(id: string) {
        return this.customerModel.findByIdAndDelete(id);
    }
}
