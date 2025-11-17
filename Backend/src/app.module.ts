import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './auth/user.entity';
import { Client } from './clients/client.entity';
import { Project } from './projects/project.entity';
import { ProjectUser } from './project-users/project-user.entity';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'assignment',
      entities: [User, Client, Project, ProjectUser],
      synchronize: true, // KEEP TRUE only for development
    }),
    ClientsModule,
    AuthModule,
  ],
})
export class AppModule {}
