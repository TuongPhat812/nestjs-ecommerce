import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class UpdateCategoryDTO {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}

export { UpdateCategoryDTO };
