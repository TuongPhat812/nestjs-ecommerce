/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UserService } from './user.service';
import { Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentications/guards';
import { RequestWithUser } from '../authentications/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FindOneParams } from '../categories/types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.userService.addPrivateFile(request.user.id, file.buffer, file.originalname);
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(@Req() request: RequestWithUser, @Param() { id }: FindOneParams) {
    const file = await this.userService.getPrivateFile(request.user.id, Number(id));
    file.stream.pipe(request.res);
  }

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  async getAllPrivateFiles(@Req() request: RequestWithUser) {
    return this.userService.getAllPrivateFiles(request.user.id);
  }
}
