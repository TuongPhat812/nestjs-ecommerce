import { Injectable } from '@nestjs/common';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dtos';
import { CategoryEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryNotFoundException } from './exceptions';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async getAllCategories(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  async getCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoriesRepository.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
      withDeleted: true,
    });
    if (!category) {
      throw new CategoryNotFoundException(id);
    }
    return category;
  }

  async restoreDeletedCategory(id: number) {
    const restoreResponse = await this.categoriesRepository.restore(id);
    if (!restoreResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }

  async createCategory(category: CreateCategoryDTO) {
    const newCategory = await this.categoriesRepository.create(category);
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategoryDTO): Promise<CategoryEntity> {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: {
        id,
      },
      relations: {
        posts: true,
      },
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  async deleteCategoryById(id: number): Promise<void> {
    return this.deleteCategory(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const deleteResponse = await this.categoriesRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }
}
