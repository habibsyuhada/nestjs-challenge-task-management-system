import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: process.env.JWTSECRET,
		});
	}

	async validate(payload: any): Promise<any> {
		const user = await this.authService.findOneByEmail(payload.email);
		if (!user) {
			throw new UnauthorizedException('User Not Found');
		} else if (user.id != payload.id) {
			throw new UnauthorizedException({
				user: user,
				payload: payload,
			});
		}
		return user;
	}
}
