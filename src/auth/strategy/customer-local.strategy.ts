import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthCustomerService } from '../service/auth.customer.service';
import { CustomerSignInDto } from '../dto/customer-sign-in.dto';

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(Strategy, 'customer-local') {
    constructor(private authCustomerService: AuthCustomerService) {
        super({
            usernameField: 'id',
            passReqToCallback: true,
        });
    }

    async validate(req: Request & { params: CustomerSignInDto }, id: string, password: string) {
        const store = req.params.id
        if (!store || store.length !== 24) {
            throw new UnauthorizedException();
        }

        const customer = await this.authCustomerService.validateCustomer(store, id, password);
        if (!customer) {
            throw new UnauthorizedException();
        }

        return customer;
    }
}
