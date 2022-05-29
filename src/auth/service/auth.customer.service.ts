import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerService } from '../../models/customer/customer.service';
import { CustomerJwtPayload } from '../interface/customer-jwt-payload.interface';
import { StoreService } from '../../models/store/store.service';

@Injectable()
export class AuthCustomerService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private customerService: CustomerService,
        private storeService: StoreService,
    ) {}

    async validateCustomer(store: string, email: string, password: string) {
        const doesExist = await this.storeService.doesExistById(store);
        if (!doesExist) return null;

        const customer = await this.customerService.getItem(store, email);
        if (customer && (await bcrypt.compare(password, customer.password))) {
            return {
                id: customer._id,
                store: customer.store
            };
        }
        return null;
    }

    signIn({ id, store }: CustomerJwtPayload) {
        const payload = { id, store };
        const accessToken = this.jwtService.sign(
            payload,
            { issuer: this.configService.get<string>('JWT_ISSUER') }
        );
        return accessToken;
    }
}
