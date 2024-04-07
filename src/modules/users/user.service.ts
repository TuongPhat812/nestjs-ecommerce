import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  UserWithEmailExistedException,
  UserWithEmailNotExistedException,
  UserWithIdNotExistedException,
} from './exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UserWithEmailNotExistedException(email);
    }
    return user;
  }

  async checkUserExistedByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    return !!user;
  }

  async create(userData: CreateUserDto) {
    const isUserExisted = await this.checkUserExistedByEmail(userData.email);
    if (isUserExisted) {
      throw new UserWithEmailExistedException(userData.email);
    }
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserWithIdNotExistedException(id.toString());
    }
    return user;
  }
}
