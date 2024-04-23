import { Module } from '@nestjs/common';
import { PostModule } from './modules/posts/post.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/databases/database.module';
import * as Joi from 'joi';
import { AuthenticationModule } from './modules/authentications/authentication.module';
import { UserModule } from './modules/users/user.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './shared/commons/exception-filters/global-exception.filter';
import { FileModule } from './modules/files/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UserModule,
    AuthenticationModule,
    PostModule,
    FileModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
