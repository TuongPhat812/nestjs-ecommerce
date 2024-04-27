import { NotFoundException } from '@nestjs/common';

class UserWithIdNotExistedException extends NotFoundException {
  constructor(id: string) {
    super(`User with id ${id} does not exist`);
  }
}

export { UserWithIdNotExistedException };
