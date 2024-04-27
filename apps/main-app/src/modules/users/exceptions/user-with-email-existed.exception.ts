import { ConflictException } from '@nestjs/common';

class UserWithEmailExistedException extends ConflictException {
  constructor(email: string) {
    super(`User with email ${email} existed`);
  }
}

export { UserWithEmailExistedException };
