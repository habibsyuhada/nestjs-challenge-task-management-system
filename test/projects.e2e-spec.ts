import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Project } from 'src/entities/project.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { ProjectsModule } from 'src/modules/projects.module';
import { TasksModule } from 'src/modules/tasks.module';
import { UsersModule } from 'src/modules/users.module';
import * as request from 'supertest';

jest.mock('bcryptjs', () => {
	return {
		compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
	};
});

describe('Project & Task (e2e)', () => {
	let app: INestApplication;

	const project = {
		id: 'ProjectID-Demo',
		name: 'ProjectName-Demo',
		user: 'ProjectUser-Demo',
		description: 'ProjectDescription-Demo',
		createdDate: 'ProjectCreatedDate-Demo',
	};

	const task = {
		id: 'TaskID-Demo',
		projectId: 'ProjectID-Demo',
		name: 'TaskName-Demo',
		description: 'TaskDescription-Demo',
		createdDate: 'TaskCreatedDate-Demo',
	};

	const mockProjectRepository = {
		find: jest.fn().mockImplementation(() => Promise.resolve([project])),
		create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
		save: jest.fn().mockImplementation((project) => Promise.resolve(project)),
		update: jest
			.fn()
			.mockImplementation((id, updateProjectDto) =>
				Promise.resolve({ id, ...updateProjectDto }),
			),
		delete: jest.fn().mockImplementation(() =>
			Promise.resolve({
				raw: [],
				affected: 1,
			}),
		),
	};
	const mockTaskRepository = {
		find: jest.fn().mockImplementation(() => Promise.resolve([task])),
		create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
		save: jest.fn().mockImplementation((task) => Promise.resolve(task)),
		update: jest
			.fn()
			.mockImplementation((id, updateTaskDto) =>
				Promise.resolve({ ...id, ...updateTaskDto }),
			),
		delete: jest.fn().mockImplementation(() =>
			Promise.resolve({
				raw: [],
				affected: 1,
			}),
		),
	};
	const mockUserRepository = {
		findOne: jest
			.fn()
			.mockImplementation((user) =>
				Promise.resolve({ ...user, id: 'ProjectUser-Demo' }),
			),
	};

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				AuthModule,
				UsersModule,
				ProjectsModule,
				TasksModule,
			],
		})
			.overrideProvider(getRepositoryToken(Project))
			.useValue(mockProjectRepository)
			.overrideProvider(getRepositoryToken(Task))
			.useValue(mockTaskRepository)
			.overrideProvider(getRepositoryToken(User))
			.useValue(mockUserRepository)
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	async function getValidToken() {
		const res = await request(app.getHttpServer()).post('/auth/login').send({
			email: 'demo@demo.com',
			password: 'demo',
		});
		const {
			body: { access_token },
		} = res;
		return access_token;
	}

	describe('Project', () => {
		it('/projects (GET)', async () => {
			const token = await getValidToken();
			return request(app.getHttpServer())
				.get('/projects')
				.auth(token, { type: 'bearer' })
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect([project]);
		});

		it('/projects (POST)', async () => {
			return request(app.getHttpServer())
				.post('/projects')
				.auth(await getValidToken(), { type: 'bearer' })
				.send(project)
				.expect(201)
				.expect('Content-Type', /application\/json/)
				.expect(project);
		});

		it('/projects (PUT)', async () => {
			return request(app.getHttpServer())
				.put('/projects/ProjectID-Demo')
				.auth(await getValidToken(), { type: 'bearer' })
				.send({
					name: 'ProjectName-Demo2',
					description: 'ProjectDescription-Demo2',
				})
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect({
					id: 'ProjectID-Demo',
					name: 'ProjectName-Demo2',
					description: 'ProjectDescription-Demo2',
				});
		});

		it('/projects (DELETE)', async () => {
			return request(app.getHttpServer())
				.delete('/projects/ProjectID-Demo')
				.auth(await getValidToken(), { type: 'bearer' })
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect({
					raw: [],
					affected: 1,
				});
		});
	});

	describe('Task', () => {
		it('/projects/:projectId/tasks (GET)', async () => {
			const token = await getValidToken();
			return request(app.getHttpServer())
				.get('/projects/ProjectID-Demo/tasks')
				.auth(token, { type: 'bearer' })
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect([task]);
		});

		it('/projects/:projectId/tasks (POST)', async () => {
			return request(app.getHttpServer())
				.post('/projects/ProjectID-Demo/tasks')
				.auth(await getValidToken(), { type: 'bearer' })
				.send(task)
				.expect(201)
				.expect('Content-Type', /application\/json/)
				.expect(task);
		});

		it('/projects/:projectId/tasks/:taskId (PUT)', async () => {
			return request(app.getHttpServer())
				.put('/projects/ProjectID-Demo/tasks/TaskID-Demo')
				.auth(await getValidToken(), { type: 'bearer' })
				.send({
					name: 'TaskName-Demo2',
					description: 'TaskDescription-Demo2',
				})
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect({
					id: 'TaskID-Demo',
					projectId: 'ProjectID-Demo',
					name: 'TaskName-Demo2',
					description: 'TaskDescription-Demo2',
				});
		});

		it('/projects/:projectId/tasks/:taskId (DELETE)', async () => {
			return request(app.getHttpServer())
				.delete('/projects/ProjectID-Demo/tasks/TaskID-Demo')
				.auth(await getValidToken(), { type: 'bearer' })
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect({
					raw: [],
					affected: 1,
				});
		});
	});
});
