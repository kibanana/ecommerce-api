import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomerJwtStrategyGuard extends AuthGuard('customer-jwt') {}