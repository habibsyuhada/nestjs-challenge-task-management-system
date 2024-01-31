import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
		const newproject = this.projectsRepository.create({...project, user});
		return this.projectsRepository.save(newproject);
	}

	async update(id: string, project: Partial<Project>): Promise<Project> {
		await this.projectsRepository.update(id, project);
		return this.projectsRepository.findOne({ where: { id } });
	}

	async delete(id: string): Promise<void> {
		await this.projectsRepository.delete(id);
	}
}
