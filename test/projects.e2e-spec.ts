import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Project } from "src/entities/project.entity";
import { Task } from "src/entities/task.entity";
import { User } from "src/entities/user.entity";
import { ProjectsModule } from "src/modules/projects.module";
import { TasksModule } from "src/modules/tasks.module";
import { UsersModule } from "src/modules/users.module";
import * as request from 'supertest';

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
      .mockImplementation((id, projectId, updateTaskDto) =>
        Promise.resolve({ id, projectId, ...updateTaskDto }),
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
      .mockImplementation((user) => Promise.resolve({ ...user, id: '1' })),
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
    // app.useGlobalPipes(
    //   new ValidationPipe({
    //     whitelist: true,
    //     stopAtFirstError: true,
    //   }),
    // );
    await app.init();
  });

  async function getValidToken() {
    const {
      body: { access_token },
    } = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: 'demo@demo.com',
      password: 'demo',
    });
    return access_token;
  }

	describe('Project', () => {
		it('/projects (GET)', async () => {
			return request(app.getHttpServer())
				.get('/projects')
				.auth(await getValidToken(), { type: 'bearer' })
				.expect(200)
				.expect('Content-Type', /application\/json/)
				.expect([project]);
		});
	});
});