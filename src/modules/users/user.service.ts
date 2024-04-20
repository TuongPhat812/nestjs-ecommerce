import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserWithEmailExistedException, UserWithEmailNotExistedException, UserWithIdNotExistedException } from './exceptions';
import { FileService } from '../files/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
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

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.fileService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.fileService.uploadPublicFile(imageBuffer, filename);
    await this.usersRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.fileService.deletePublicFile(fileId);
    }
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.fileService.uploadPrivateFile(imageBuffer, userId, filename);
  }

  async getPrivateFile(userId: number, fileId: number) {
    const file = await this.fileService.getPrivateFile(fileId);
    if (file.info.owner.id === userId) {
      return file;
    }
    throw new UnauthorizedException();
  }

  async getAllPrivateFiles(userId: number) {
    const userWithFiles = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { files: true },
    });
    if (userWithFiles) {
      return Promise.all(
        userWithFiles.files.map(async (file) => {
          const url = await this.fileService.generatePresignedUrl(file.key);
          return {
            ...file,
            url,
          };
        }),
      );
    }
    throw new NotFoundException('User with this id does not exist');
  }
}
