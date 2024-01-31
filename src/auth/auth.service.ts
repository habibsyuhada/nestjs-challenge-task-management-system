import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}

	async validateUserLocal(email: string, password: string): Promise<any> {
		const user: User = await this.usersService.findOneByEmail(email);
		if (
			user &&
			(await this.usersService.comparePassword(password, user.password))
		) {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: User) {
		const payload = { id: user.id, email: user.email };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async findOneByEmail(email: string) {
		return await this.usersService.findOneByEmail(email);
	}

	async create(user: Partial<User>) {
		return await this.usersService.create(user);
	}
}
