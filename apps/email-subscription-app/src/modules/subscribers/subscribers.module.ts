import { Module } from '@nestjs/common';
import SubscribersController from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import SubscriberEntity from './entities/subscriber.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { SubscribersConsumer } from './rabbitmq/subscribers.consumer';
import SubscribersGRPCController from './grpc/subscribers.server';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([SubscriberEntity]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'subscribers-ex',
          type: 'topic',
        },
      ],
      uri: `amqp://admin:admin@localhost:5672`,
      channels: {
        'email-subscription-q': {
          prefetchCount: 1,
        },
      },
    }),
  ],
  controllers: [SubscribersController, SubscribersGRPCController],
  providers: [SubscribersService, SubscribersConsumer],
})
export class SubscribersModule {}
