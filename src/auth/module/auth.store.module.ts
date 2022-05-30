import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Store, StoreSchema } from '../../models/store/schema/store.schema';
import { StoreModule } from '../../models/store/store.module';
import { AuthStoreController } from '../controller/auth.store.controller';
import { AuthStoreService } from '../service/auth.store.service';
import { StoreLocalStrategy } from '../strategy/store-local.strategy';
import { StoreJwtStrategy } from '../strategy/store-jwt.strategy';

@Module({
	imports: [
		ConfigModule,
        PassportModule,
		JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_STORE_SECRET'),
                    signOptions: { expiresIn: configService.get<string>('JWT_STORE_EXPIRES_IN') },
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
        StoreModule,
	],
	controllers: [AuthStoreController],
	providers: [
        AuthStoreService,
        StoreLocalStrategy,
        StoreJwtStrategy,
    ],
    exports: [AuthStoreService],
})
export class AuthStoreModule {}
