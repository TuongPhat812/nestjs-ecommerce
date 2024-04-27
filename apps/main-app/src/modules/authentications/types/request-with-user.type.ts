import { Request } from 'express';
import { UserEntity } from '../../users/entities/user.entity';

type RequestWithUser = Request & {
  user: UserEntity;
};

export { RequestWithUser };
