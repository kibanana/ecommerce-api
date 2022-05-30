import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomerService } from '../../models/customer/customer.service';
import { CustomerJwtPayload } from '../interface/customer-jwt-payload.interface';
import { StoreService } from '../../models/store/store.service';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
    constructor(
        private configService: ConfigService,
        private customerService: CustomerService,
        private storeService: StoreService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_CUSTOMER_SECRET'),
        });
    }

    async validate(payload: CustomerJwtPayload) {
        const { id, store } = payload;

        const storeDoesExist = await this.storeService.doesExistById(store);
        if (!storeDoesExist) {
            throw new UnauthorizedException();
        }

        const customerDoesExist = await this.customerService.doesExistById(id);
        if (!customerDoesExist) {
            throw new UnauthorizedException();
        }

        return { id, store };
    }
}
