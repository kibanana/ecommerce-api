import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthCustomerService } from '../service/auth.customer.service';

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, 'customer-local') {
    constructor(private authCustomerService: AuthCustomerService) {
        super({ usernameField: 'id' });
    }

    async validate(id: string, password: string) {
        const customer = await this.authCustomerService.validateCustomer(id, password);

        if (!customer) {
            throw new UnauthorizedException();
        }

        return customer;
    }
}
