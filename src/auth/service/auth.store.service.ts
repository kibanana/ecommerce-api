import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StoreService } from '../../models/store/store.service';
import { StoreJwtPayload } from '../interface/store-jwt-payload.interface';

@Injectable()
export class AuthStoreService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private storeService: StoreService,
    ) {}

    async validateStore(email: string, password: string) {
        const store = await this.storeService.getItem(email);

        if (store && (await bcrypt.compare(password, store.password))) {
            const { _id: id } = store;

            return { id };
        }
        return null;
    }

    signIn({ id }: StoreJwtPayload) {
        const payload = { id };
        const accessToken = this.jwtService.sign(
            payload,
            { issuer: this.configService.get<string>('JWT_ISSUER') }
        );
        return accessToken;
    }
}
