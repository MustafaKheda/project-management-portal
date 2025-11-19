import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Client } from '../clients/client.entity';
import { ProjectUser } from '../project-users/project-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: 'member' }) 
  role: string;

  @ManyToOne(() => Client, client => client.users, { onDelete: 'CASCADE' })
  client: Client;

  @OneToMany(() => ProjectUser, (pu) => pu.user)
  projectUsers: ProjectUser[];
}
