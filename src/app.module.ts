import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './modules/projects.module';
import { TasksModule } from './modules/tasks.module';

@Module({
	imports: [
		UsersModule,
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: process.env.DBTYPE as any,
			host: process.env.DBHOST,
			port: parseInt(process.env.DBPORT),
			username: process.env.DBUSER,
			password: process.env.DBPASSWORD,
			database: process.env.DBNAME,
			entityPrefix: process.env.PREFIXTABLE,
			ssl: true,
			autoLoadEntities: true,
			synchronize: true,
		}),
		AuthModule,
		ProjectsModule,
		TasksModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
