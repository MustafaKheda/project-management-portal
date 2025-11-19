import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AssignUserDto } from 'src/project-users/dto/assign-user.dto';
import { UpdateProjectUserRoleDto } from 'src/project-users/dto/update-project-user.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  async getProjects(@Req() req, @Query("page") page = 1, @Query("limit") limit = 10, @Query("search") search = "") {
    return this.projectsService.getProjects(req.user, page, limit,search);
  }
  @Post()
  async createProject(@Body() dto: CreateProjectDto, @Req() req) {
    const user = req.user; 

    return this.projectsService.createProject(dto, user);
  }

  @Get(':id')
  async getProject(@Param('id') projectId: string, @Req() req) {
    return this.projectsService.getProjectById(projectId, req.user);
  }

  @Put(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Body() dto: UpdateProjectDto,
    @Req() req,
  ) {
    return this.projectsService.updateProject(projectId, dto, req.user);
  }

  @Delete(':id')
  async deleteProject(@Param('id') projectId: string, @Req() req) {
    return this.projectsService.deleteProject(projectId, req.user);
  }

  @Post(':id/users')
  async assignUserToProject(
    @Param('id') projectId: string,
    @Body() dto: AssignUserDto,
    @Req() req,
  ) {
    return this.projectsService.assignUser(projectId, dto, req.user);
  }

  @Put(':id/users/:userId')
  async updateUserRole(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateProjectUserRoleDto,
    @Req() req,
  ) {
    return this.projectsService.updateUserRole(
      projectId,
      userId,
      dto.role,
      req.user,
    );
  }

  @Delete(':id/users/:userId')
  async removeUser(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.projectsService.removeUser(projectId, userId, req.user);
  }

  @Get(':id/users')
  async getAssignedUsers(@Param('id') projectId: string, @Req() req) {
    return this.projectsService.getAssignedUsers(projectId, req.user);
  }
}
