import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private tasksRepository: Repository<Task>,
	) {}

	async findAll(projectId: string): Promise<Task[]> {
		return this.tasksRepository.find({ where: { projectId } });
	}

	async findOne(projectId: string, taskId: string): Promise<Task> {
		return this.tasksRepository.findOne({ where: { id: taskId, projectId } });
	}

	async create(projectId: string, task: Partial<Task>): Promise<Task> {
		const newtask = this.tasksRepository.create({ ...task, projectId });
		return this.tasksRepository.save(newtask);
	}

	async update(
		projectId: string,
		taskId: string,
		task: Partial<Task>,
	): Promise<UpdateResult> {
		return this.tasksRepository.update({ id: taskId, projectId }, task);
	}

	async delete(projectId: string, taskId: string): Promise<DeleteResult> {
		return this.tasksRepository.delete({ id: taskId, projectId });
	}

	async deleteAll(projectId: string): Promise<DeleteResult> {
		return this.tasksRepository.delete({ projectId });
	}
}
