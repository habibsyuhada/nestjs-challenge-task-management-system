import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOne(id: string): Promise<User> {
		return this.userRepository.findOne({ where: { id } });
	}

	async findOneByEmail(email: string): Promise<User> {
		return this.userRepository.findOne({ where: { email } });
	}

	async create(user: Partial<User>): Promise<User> {
		user.password = await this.encryptPassword(user.password);
		const newuser = this.userRepository.create(user);
		return this.userRepository.save(newuser);
	}

	async update(id: string, user: Partial<User>): Promise<UpdateResult> {
		return this.userRepository.update(id, user);
	}

	async delete(id: string): Promise<void> {
		await this.userRepository.delete(id);
	}

	async encryptPassword(password: string) {
		return await bcrypt.hash(password, 10);
	}

	async comparePassword(password: string, hash: string) {
		return await bcrypt.compare(password, hash);
	}
}
