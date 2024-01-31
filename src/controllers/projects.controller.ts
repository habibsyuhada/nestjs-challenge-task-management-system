import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Task } from '../entities/task.entity';
import { TasksService } from '../services/tasks.service';
import { Project } from '../entities/project.entity';
import { ProjectsService } from '../services/projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService, private readonly tasksService: TasksService) {}
	
	@Get()
	async findAll() {
		return this.projectsService.findAll();
	}

	@Post()
	async create(@Body() project: Project, @Req() req): Promise<Project> {
		return this.projectsService.create(project, req.user.id);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() project: Project): Promise<any> {
		return this.projectsService.update(id, project);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<any> {
		const project = await this.projectsService.findOne(id);
		if (!project) {
			throw new NotFoundException('Project does not exist!');
		}
		await this.projectsService.delete(id);
		return this.tasksService.deleteAll(id);;
	}

	@Get(':projectId/tasks')
	async findAllTasks(@Param('projectId') projectId: string) {
		return this.tasksService.findAll(projectId);
	}

	@Post(':projectId/tasks')
	async createTask(@Param('projectId') projectId: string, @Body() task: Task) {
		return this.tasksService.create(projectId, task);
	}

	@Put(':projectId/tasks/:taskId')
	async updateTask(@Param('projectId') projectId: string, @Param('taskId') taskId: string, @Body() task: Task) {
		return this.tasksService.update(projectId, taskId, task);
	}

	@Delete(':projectId/tasks/:taskId')
	async removeTask(@Param('projectId') projectId: string, @Param('taskId') taskId: string) {
		const project = await this.tasksService.findOne(projectId, taskId);
		if (!project) {
			throw new NotFoundException('Project does not exist!');
		}
		return this.tasksService.delete(projectId, taskId);
	}
}
