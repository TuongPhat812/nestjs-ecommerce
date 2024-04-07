import { Module } from '@nestjs/common';
import CategoriesController from './category.controller';
import CategoriesService from './category.service';
import { CategoryEntity } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
