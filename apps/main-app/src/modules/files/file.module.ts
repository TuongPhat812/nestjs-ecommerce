import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { ConfigModule } from '@nestjs/config';
import { PublicFileEntity, PrivateFileEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([PublicFileEntity, PrivateFileEntity]), ConfigModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
