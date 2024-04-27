import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'subscriber' })
class SubscriberEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;
}

export default SubscriberEntity;
