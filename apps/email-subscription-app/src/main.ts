import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ExcludeNullInterceptor } from './shared/commons/interceptors/exclude-null.interceptor';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new ExcludeNullInterceptor());
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'subscribers',
      protoPath: join(__dirname, 'modules/subscribers/subscribers.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });

  app.startAllMicroservices();

  await app.listen(3001);
}
bootstrap();
