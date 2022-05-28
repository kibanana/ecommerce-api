import {
    HttpException,
    HttpStatus,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: true,
        exceptionFactory: (errors) => {
            throw new HttpException('ERR_INVALID_PARAM', HttpStatus.BAD_REQUEST);
        },
    }));
    await app.listen(3000);
}
bootstrap();
