import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectUser } from 'src/project-users/project-user.entity';
import { User } from 'src/auth/user.entity';
import { Client } from 'src/clients/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectUser, User, Client]), // 👈 REQUIRED
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
