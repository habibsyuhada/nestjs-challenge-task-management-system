import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Docs')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Redirect('/docs')
	index() {
		return {};
	}
}
