import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { GetCustomerListDto } from '../custom-field/dto/get-customer-list.dto';
import { CustomerCreateDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerPasswordDto } from './dto/update-customer-password.dto';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { CustomerCreateParamDto } from './dto/create-customer-param.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    ) {}

    createItem({ id: store, name, email, password }: CustomerCreateParamDto & CustomerCreateDto) {
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
        return this.customerModel.findById(id, '-password');
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

    updateItemPasssword(id: string, { newPassword: password }: UpdateCustomerPasswordDto) {
        return this.customerModel.findByIdAndUpdate(id, { password });
    }
}
