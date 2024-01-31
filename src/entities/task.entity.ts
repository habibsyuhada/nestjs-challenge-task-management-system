import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Task {
	@ApiProperty({
		example: 'fbb6fc3e-a65c-4393-a0d3-ad0870cc2097',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'fbb6fc3e-a65c-4393-a0d3-ad0870cc2097',
	})
	@Column({
		nullable: false,
	})
	projectId: string;

	@ApiProperty({
		example: 'Task Demo',
	})
	@Column()
	name: string;

	@ApiPropertyOptional({
		example: 'Task Description Demo',
	})
	@Column({
		nullable: true,
	})
	description: string;

	@ApiPropertyOptional({
		example: '2024-01-30T20:39:37.570Z',
	})
	@CreateDateColumn({
		type: 'timestamp',
		default: null,
	})
	createdDate: Date;
}
