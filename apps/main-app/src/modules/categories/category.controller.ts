import { Body, Controller, Delete, Get, Param, Patch, UseGuards, UseInterceptors, ClassSerializerInterceptor, Post } from '@nestjs/common';
import CategoriesService from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
import { JwtAccessTokenAuthenticationGuard } from '../authentications/guards';
import { FindOneParams } from './types';

@Controller('categories')
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param() { id }: FindOneParams) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Post()
  @UseGuards(JwtAccessTokenAuthenticationGuard)
  async createCategory(@Body() category: CreateCategoryDTO) {
    return this.categoriesService.createCategory(category);
  }

  @Patch(':id')
  async updateCategory(@Param() { id }: FindOneParams, @Body() category: UpdateCategoryDTO) {
    return this.categoriesService.updateCategory(Number(id), category);
  }

  @Delete(':id')
  async deleteCategory(@Param() { id }: FindOneParams) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
