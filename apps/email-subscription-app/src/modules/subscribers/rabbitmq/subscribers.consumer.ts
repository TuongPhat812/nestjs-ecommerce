import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SubscriberEntity from '../entities/subscriber.entity';
import AddSubscriberDto from '../dtos/add-subscriber.dto';
import { Repository } from 'typeorm';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class SubscribersConsumer {
  constructor(
    @InjectRepository(SubscriberEntity)
    private subscribersRepository: Repository<SubscriberEntity>,
  ) {}

  @RabbitSubscribe({
    exchange: 'subscribers-ex',
    routingKey: 'subscriber.created',
    queue: 'email-subscription-q',
  })
  public async pubSubHandler(msg: AddSubscriberDto) {
    Logger.log(`Received message: ${JSON.stringify(msg)}`);
  }
}
