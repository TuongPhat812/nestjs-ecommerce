import { Controller, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export default class SubscribersController {
  constructor() {}
}
