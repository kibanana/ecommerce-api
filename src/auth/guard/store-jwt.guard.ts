import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class StoreJwtStrategyGuard extends AuthGuard('store-jwt') {}