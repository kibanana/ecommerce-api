import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StoreLocalStrategyGuard extends AuthGuard('store-local') {}