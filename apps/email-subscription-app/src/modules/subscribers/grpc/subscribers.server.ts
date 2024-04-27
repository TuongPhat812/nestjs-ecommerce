import { Controller, UseInterceptors, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AddSubscriberDto } from '../dtos/add-subscriber.dto';


@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersGRPCController {
  constructor() {}

  @GrpcMethod('SubscribersService', 'AddSubscriber')
  async addSubscriber(subscriber: AddSubscriberDto) {
    Logger.log(`Received message: ${JSON.stringify(subscriber)}`);
    return subscriber;
  }
}
