import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	async login(@Req() req) {
		return this.authService.login(req.user);
	}

	@Post('register')
	async register(@Body() userInput: User): Promise<any> {
		const user = await this.authService.findOneByEmail(userInput.email);
		if (user) {
			throw new HttpException('USER_ALREADY_REGISTERED', HttpStatus.CONFLICT);
		}
		return await this.authService.create(userInput);
	}
}
