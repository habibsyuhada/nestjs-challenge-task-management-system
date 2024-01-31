import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<User> {
		const user = await this.usersService.findOne(id);
		if (!user) {
			throw new NotFoundException('User does not exist!');
		} else {
			return user;
		}
	}

	@Post()
	async create(@Body() user: User): Promise<User> {
		return this.usersService.create(user);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() user: User): Promise<any> {
		return this.usersService.update(id, user);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<any> {
		const user = await this.usersService.findOne(id);
		if (!user) {
			throw new NotFoundException('User does not exist!');
		}
		return this.usersService.delete(id);
	}
}
