import { Module } from '@nestjs/common';
import { PostModule } from './modules/posts/post.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/databases/database.module';
import * as Joi from 'joi';

@Module({
  imports: [
    PostModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
