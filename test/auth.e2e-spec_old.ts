import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from 'src/services/users.service';

jest.mock('../src/auth/auth.service');

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService:UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authService = moduleFixture.get<AuthService>(AuthService);
    userService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const userInput = {
				id: null,
				name: "Demo",
				email: "demo@demo.com",
				password: "demo",
				createdDate: null
      };

      // Mock the necessary behavior in AuthService
      jest.spyOn(authService, 'findOneByEmail').mockResolvedValueOnce(null);
      jest.spyOn(authService, 'create').mockResolvedValueOnce(userInput);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userInput);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(userInput);
    });

    it('should throw conflict error if user already exists', async () => {
      const userInput = {
				id: null,
				name: "Demo",
				email: "demo@demo.com",
				password: "demo",
				createdDate: null
      };

      // Mock the behavior to return an existing user
      jest.spyOn(authService, 'findOneByEmail').mockResolvedValueOnce(userInput);

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userInput);

      expect(response.status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should return an access token', async () => {
      const mockedAccessToken = {
				access_token: "demo_token"
			};
      const mockedUserValid = {
				id: "DemoID",
				email: "demo@demo.com",
  			password: "demo",
  			name: "Demo",
  			createdDate: "2024-01-31 03:39:37.570",
			};
      const loginInput = {
				email: "demo@demo.com",
  			password: "demo"
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(mockedAccessToken);
			jest.spyOn(authService, 'validateUserLocal').mockResolvedValueOnce(mockedUserValid);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(mockedAccessToken);
    });
  });
});
