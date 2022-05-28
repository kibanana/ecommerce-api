import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StoreService } from '../../models/store/store.service';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class StoreJwtStrategy extends PassportStrategy(Strategy, 'store-jwt') {
    constructor(
        private configService: ConfigService,
        private storeService: StoreService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_STORE_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const { id } = payload;

        const store = await this.storeService.getItemById(id);
        if (!store) {
            throw new UnauthorizedException();
        }

        return { id };
    }
}
