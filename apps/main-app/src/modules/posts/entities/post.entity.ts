import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { UserEntity } from '../../users/entities';
import { CategoryEntity } from '../../categories/entities';

@Entity({ name: 'post' })
class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Index('post_author_index')
  @ManyToOne(() => UserEntity, (author: UserEntity) => author.posts)
  public author: UserEntity;

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  public categories: CategoryEntity[];
}

export { PostEntity };
