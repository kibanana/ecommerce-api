import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CustomerLocalStrategyGuard extends AuthGuard('customer-local') {}