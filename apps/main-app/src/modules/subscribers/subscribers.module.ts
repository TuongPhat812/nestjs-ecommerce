import { Module } from '@nestjs/common';
import SubscribersController from './subscribers.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'subscribers-ex',
          type: 'topic',
        },
      ],
      uri: `amqp://admin:admin@localhost:5672`,
    }),
  ],
  controllers: [SubscribersController],
  providers: [
    {
      provide: 'SUBSCRIBERS_PACKAGE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: 'subscribers',
            protoPath: join(__dirname, 'subscribers.proto'),
            url: configService.get('GRPC_CONNECTION_URL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class SubscribersModule {}
