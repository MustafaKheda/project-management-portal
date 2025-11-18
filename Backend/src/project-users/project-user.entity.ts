import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../auth/user.entity';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.projectUsers)
  project: Project;

  @ManyToOne(() => User, (user) => user.projectUsers)
  user: User;

  @Column()
  role: string; // owner / developer / viewer

  @CreateDateColumn()
  created_at: Date;
}
