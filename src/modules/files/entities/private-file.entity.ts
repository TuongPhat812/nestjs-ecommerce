import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities';

@Entity({ name: 'private_file' })
class PrivateFileEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public key: string;

  @ManyToOne(() => UserEntity, (owner: UserEntity) => owner.files)
  public owner: UserEntity;
}

export { PrivateFileEntity };
