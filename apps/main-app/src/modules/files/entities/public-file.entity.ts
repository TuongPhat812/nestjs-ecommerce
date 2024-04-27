import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'public_file' })
class PublicFileEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export { PublicFileEntity };
