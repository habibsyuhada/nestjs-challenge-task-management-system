import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/modules/users.module';
import * as request from 'supertest';

jest.mock('bcryptjs', () => {
	return {
		compare: jest.fn().mockImplementation(() => Promise.resolve(true)),
	};
});

describe('Authentication (e2e)', () => {
	let app: INestApplication;

	const user = {
		id: 'UserID-Demo',
		name: 'UserName-Demo',
		email: 'UserEmail-Demo',
		password: 'UserPassword-Demo',
		createdDate: 'UserCreatedDate-Demo',
	};

	const mockUserRepository = {
		find: jest.fn().mockImplementation(() => Promise.resolve([user])),
		create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
		save: jest.fn().mockImplementation((user) => Promise.resolve(user)),
		findOne: jest.fn().mockImplementation((user) =>
			Promise.resolve({
				...user,
				id: 'ProjectUser-Demo',
				email: 'demo@demo.com',
			}),
		),
	};

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				AuthModule,
				UsersModule,
			],
		})
			.overrideProvider(getRepositoryToken(User))
			.useValue(mockUserRepository)
			.compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST)', async () => {
		const loginInput = {
			email: 'demo@demo.com',
			password: 'demo',
		};

		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginInput)
			.expect(201)
			.expect('Content-Type', /application\/json/)
			.expect((res) => {
				expect(res.body).toHaveProperty('access_token');
			});
	});

	it('/auth/register (POST)', async () => {
		return request(app.getHttpServer())
			.post('/auth/register')
			.send(user)
			.expect(409); //Will return Conflict code because mockrepository
	});
});
