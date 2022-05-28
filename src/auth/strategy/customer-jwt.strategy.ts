import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomerService } from '../../models/customer/customer.service';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(Strategy, 'customer-jwt') {
    constructor(
        private configService: ConfigService,
        private customerService: CustomerService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_CUSTOMER_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const { id } = payload;

        const customer = await this.customerService.getItemById(id);
        if (!customer) {
            throw new UnauthorizedException();
        }

        return { id };
    }
}
