import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import SubscriberEntity from './entities/subscriber.entity';

import { Repository } from 'typeorm';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectRepository(SubscriberEntity)
    private subscribersRepository: Repository<SubscriberEntity>,
  ) {}

  async getAllSubscribers() {
    return this.subscribersRepository.find();
  }
}
