import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User {
	@ApiProperty({
		example: 'fbb6fc3e-a65c-4393-a0d3-ad0870cc2097',
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'Habib Syuhada',
	})
	@Column({
		nullable: false,
	})
	name: string;

	@ApiProperty({
		example: 'habibsyuhada@demo.com',
	})
	@Column({
		nullable: false,
		unique: true,
	})
	email: string;

	@ApiProperty({
		example: 'LUVmicin999999',
	})
	@Column({
		nullable: false,
	})
	password: string;

	@ApiPropertyOptional({
		example: '2024-01-30T20:39:37.570Z',
	})
	@CreateDateColumn({
		type: 'timestamp',
		default: null,
	})
	createdDate: Date;
}
