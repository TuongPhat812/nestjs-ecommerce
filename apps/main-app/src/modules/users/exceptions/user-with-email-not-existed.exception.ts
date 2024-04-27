import { NotFoundException } from '@nestjs/common';

class UserWithEmailNotExistedException extends NotFoundException {
  constructor(email: string) {
    super(`User with email ${email} does not exist`);
  }
}

export { UserWithEmailNotExistedException };
