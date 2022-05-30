import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthStoreService } from '../service/auth.store.service';

@Injectable()
export class StoreLocalStrategy extends PassportStrategy(Strategy, 'store-local') {
    constructor(private authStoreService: AuthStoreService) {
        super({ usernameField: 'id' });
    }

    async validate(id: string, password: string) {
        const store = await this.authStoreService.validateStore(id, password);

        if (!store) {
            throw new UnauthorizedException();
        }

        return store;
    }
}
