import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../user/user.entity';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.projectUsers,{ onDelete: "CASCADE"})
  project: Project;

  @ManyToOne(() => User, (user) => user.projectUsers)
  user: User;

  @Column()
  role: string; // owner / developer / viewer

  @CreateDateColumn()
  created_at: Date;
}
