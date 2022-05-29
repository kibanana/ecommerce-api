import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StoreService } from '../../models/store/store.service';
import { StoreJwtPayload } from '../interface/store-jwt-payload.interface';

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

    async validate(payload: StoreJwtPayload) {
        const { id } = payload;

        const doesExist = await this.storeService.doesExistById(id);
        if (!doesExist) {
            throw new UnauthorizedException();
        }

        return { id };
    }
}
