import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectsService {
	constructor(
		@InjectRepository(Project)
		private projectsRepository: Repository<Project>,
	) {}

	async findAll(): Promise<Project[]> {
		return this.projectsRepository.find();
	}

	async findOne(id: string): Promise<Project> {
		return this.projectsRepository.findOne({ where: { id } });
	}

	async create(project: Partial<Project>, user: string): Promise<Project> {
		const newproject = this.projectsRepository.create({ ...project, user });
		return this.projectsRepository.save(newproject);
	}

	async update(id: string, project: Partial<Project>): Promise<UpdateResult> {
		return this.projectsRepository.update(id, project);
	}

	async delete(id: string): Promise<DeleteResult> {
		return this.projectsRepository.delete(id);
	}
}
