import { Controller, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthStoreService } from '../service/auth.store.service';
import { StoreLocalStrategyGuard } from '../guard/store-local.guard';

@Controller('auth/stores')
export class AuthStoreController {
    constructor(private authStoreService: AuthStoreService) {}

    @UseGuards(StoreLocalStrategyGuard)
    @Post('/sign-in')
    SignIn(@Request() req) {
        try {
            return this.authStoreService.signIn(req.user);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
