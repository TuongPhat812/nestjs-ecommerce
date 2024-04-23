import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { AddressEntity } from './address.entity';
import { PostEntity } from '../../posts/entities';
import { PublicFileEntity, PrivateFileEntity } from '../../files/entities';

@Entity({ name: 'user' })
class UserEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => AddressEntity, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: AddressEntity;

  @OneToMany(() => PostEntity, (post: PostEntity) => post.author)
  public posts?: PostEntity[];

  @JoinColumn()
  @OneToOne(() => PublicFileEntity, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFileEntity;

  @OneToMany(() => PrivateFileEntity, (file: PrivateFileEntity) => file.owner)
  public files?: PrivateFileEntity[];

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}

export { UserEntity };
