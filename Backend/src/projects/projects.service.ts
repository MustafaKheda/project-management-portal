// projects/projects.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectUser } from '../project-users/project-user.entity';
import { AssignUserDto } from 'src/project-users/dto/assign-user.dto';
import { User } from 'src/auth/user.entity';
import { checkProjectAdminOrOwner } from './helpers/rbac.helper';
import { count } from 'console';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(ProjectUser)
    private projectUserRepo: Repository<ProjectUser>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async createProject(dto: CreateProjectDto, user: any) {
    console.log('Creating project for user:', user);
    // 1. Allow if global admin
    if (user.role !== 'admin') {
      // 2. Check if user is OWNER in any project of that client
      const isOwner = await this.projectUserRepo.findOne({
        where: {
          user: { id: user.id },
          role: 'owner',
        },
        relations: ['project'],
      });

      if (!isOwner) {
        throw new ForbiddenException(
          'Only global admin or project owner can create a project',
        );
      }
    }

    // 3. Create project
    const project = this.projectRepo.create({
      name: dto.name,
      description: dto.description,
      client: { id: user.clientId },
    });

    await this.projectRepo.save(project);

    return {
      message: 'Project created successfully',
      project,
    };
  }

  async assignUser(projectId: string, dto: AssignUserDto, currentUser: any) {
    const { user_id, role } = dto;

    // 1. Load project
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // 2. Check RBAC – Only Global Admin OR Project Owner
    await checkProjectAdminOrOwner(projectId, currentUser, this.projectUserRepo);

    // 3. User must exist
    const userToAssign = await this.userRepo.findOne({
      where: { id: user_id },
      relations: ['client'],
    });
    console.log(userToAssign)

    if (!userToAssign) {
      throw new NotFoundException('User not found');
    }

    // 4. Prevent assigning users from another client
    if (userToAssign.client.id !== project.client.id) {
      throw new ForbiddenException(
        'User does not belong to the same client/company'
      );
    }

    // 5. Prevent duplicate assignment
    const existingAssignment = await this.projectUserRepo.findOne({
      where: {
        project: { id: projectId },
        user: { id: user_id },
      },
    });

    if (existingAssignment) {
      throw new ConflictException('User is already assigned to this project');
    }

    // 6. Assign user
    const assignment = this.projectUserRepo.create({
      project,
      user: userToAssign,
      role,
    });

    await this.projectUserRepo.save(assignment);

    return {
      message: 'User assigned to project successfully',
      assignment,
    };
  }

  async updateUserRole(projectId: string, userId: string, newRole: string, currentUser: any) {
    // RBAC Check
    await checkProjectAdminOrOwner(projectId, currentUser, this.projectUserRepo);

    // Load existing ProjectUser
    const assignment = await this.projectUserRepo.findOne({
      where: {
        project: { id: projectId },
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (!assignment) {
      throw new NotFoundException('User is not assigned to this project');
    }

    // Update role
    assignment.role = newRole;
    await this.projectUserRepo.save(assignment);

    return {
      message: 'Project user role updated successfully',
      assignment,
    };
  }

  async removeUser(projectId: string, userId: string, currentUser: any) {
    // RBAC Check
    await checkProjectAdminOrOwner(projectId, currentUser, this.projectUserRepo);
    const assignment = await this.projectUserRepo.findOne({
      where: {
        project: { id: projectId },
        user: { id: userId },
      },
    });

    if (!assignment) {
      throw new NotFoundException('User is not assigned to this project');
    }

    await this.projectUserRepo.remove(assignment);

    return { message: 'User removed from project successfully' };
  }

  async getAssignedUsers(projectId: string, currentUser: any) {
    // Ensure user belongs to same client
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Fetch assigned users
    const assignedUsers = await this.projectUserRepo.find({
      where: { project: { id: projectId } },
      relations: ['user'],
      select: {
        id: true,
        role: true,
        user: {
          id: true,
          email: true,
        },
      },
    });

    return {
      users: assignedUsers,
      count: assignedUsers.length
    };
  }

  async getProjectById(projectId: string, currentUser: any) {
    // Load project + assigned users
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client', 'projectUsers', 'projectUsers.user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    console.log(currentUser, project.client.id)

    // Ensure user belongs to same client
    if (project.client.id !== currentUser.clientId) {
      throw new ForbiddenException('Not allowed to access this project');
    }

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      assigned_users: project.projectUsers.map((pu) => ({
        id: pu.user.id,
        email: pu.user.email,
        role: pu.role,
      })),
      created_at: project.created_at,
      updated_at: project.updated_at,
    };
  }

  async updateProject(projectId: string, dto: UpdateProjectDto, currentUser: any) {
    // Prevent empty and wrong field updates
    if (!dto.name?.trim() && !dto.description?.trim()) {
      throw new BadRequestException(
        'Please provide at least one valid field to update (name or description).',
      );
    }
    // RBAC Check
    await checkProjectAdminOrOwner(projectId, currentUser, this.projectUserRepo);
    // Load project
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Apply updates
    if (dto.name?.trim()) project.name = dto.name.trim();
    if (dto.description?.trim()) project.description = dto.description.trim();

    await this.projectRepo.save(project);

    return {
      message: 'Project updated successfully',
      project,
    };
  }

  async deleteProject(projectId: string, currentUser: any) {
    // RBAC Check
    await checkProjectAdminOrOwner(projectId, currentUser, this.projectUserRepo);

    // Load project
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectRepo.remove(project);
    return { message: 'Project deleted successfully' };
  }

  async getProjects(currentUser: any) {
    const projects = await this.projectRepo.find({
      where: {
        client: { id: currentUser.clientId },
      },
      relations: ['projectUsers', 'projectUsers.user'], // 👈 ALWAYS include assigned users
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
      assigned_users: project.projectUsers.map((pu) => ({
        id: pu.user.id,
        email: pu.user.email,
        role: pu.role,
      })),
    }));
  }

}
