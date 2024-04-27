import { IsString, IsNotEmpty } from 'class-validator';

class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export { CreateCategoryDTO };
