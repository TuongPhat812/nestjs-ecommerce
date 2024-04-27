/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Post, UseGuards, UseInterceptors, ClassSerializerInterceptor, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { JwtAccessTokenAuthenticationGuard } from '../authentications/guards';
import CreateSubscriberDto from './dtos/add-subscriber.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import SubscribersService from './subscribers.service.interface';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersController implements OnModuleInit {
  private subscribersService: SubscribersService;
  constructor(
    @Inject('SUBSCRIBERS_PACKAGE') private client: ClientGrpc,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  onModuleInit() {
    this.subscribersService = this.client.getService<SubscribersService>('SubscribersService');
  }

  @Post()
  @UseGuards(JwtAccessTokenAuthenticationGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto): Promise<any> {
    await this.amqpConnection.publish<CreateSubscriberDto>('subscribers-ex', 'subscriber.created', subscriber);
    const result = await this.subscribersService.addSubscriber(subscriber);
    Logger.log(`Sent data::: ${JSON.stringify(subscriber)}`);
    return result
  }

}
