import { Controller, Post, UseGuards, Request, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AuthCustomerService } from '../service/auth.customer.service';
import { CustomerLocalStrategyGuard } from '../guard/customer-local.guard';
import { CustomerSignInDto } from '../dto/customer-sign-in.dto';

@Controller('auth')
export class AuthCustomerController {
    constructor(private authCustomerService: AuthCustomerService) {}

    @UseGuards(CustomerLocalStrategyGuard)
    @Post('/stores/:id/customers/sign-in')
    SignIn(@Param() customerSignInData: CustomerSignInDto, @Request() req) {
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
