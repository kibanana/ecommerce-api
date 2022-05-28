import { Module } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthStoreController } from '../controller/auth.store.controller';

@Module({
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
                };
            },
            inject: [ConfigService]
        }),
	]
	providers: [AuthService],
	controllers: [AuthStoreController]
})
export class AuthStoreModule {}
