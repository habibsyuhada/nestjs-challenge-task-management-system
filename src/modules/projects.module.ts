import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from '../controllers/projects.controller';
import { Project } from '../entities/project.entity';
import { ProjectsService } from '../services/projects.service';
import { TasksModule } from '../modules/tasks.module';

@Module({
	imports: [TypeOrmModule.forFeature([Project]), TasksModule],
	controllers: [ProjectsController],
	providers: [ProjectsService],
})
export class ProjectsModule {}
