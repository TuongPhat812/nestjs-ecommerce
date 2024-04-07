import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from 'src/modules/posts/entities';

@Entity({ name: 'category' })
class CategoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToMany(() => PostEntity, (post: PostEntity) => post.categories)
  public posts: PostEntity[];
}

export { CategoryEntity };
