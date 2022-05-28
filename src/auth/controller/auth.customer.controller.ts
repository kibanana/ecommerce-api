import { Controller, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthCustomerService } from '../service/auth.customer.service';
import { CustomerLocalStrategyGuard } from '../guard/customer-local.guard';

@Controller('auth/customers')
export class AuthCustomerController {
    constructor(private authCustomerService: AuthCustomerService) {}

    @UseGuards(CustomerLocalStrategyGuard)
    @Post('/sign-in')
    SignIn(@Request() req) {
        try {
            return this.authCustomerService.signIn(req.user);
        } catch (err) {
            if (err instanceof HttpException) {
                throw err;
            }
            
            throw new HttpException('ERR_INTERNAL_SERVER', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
