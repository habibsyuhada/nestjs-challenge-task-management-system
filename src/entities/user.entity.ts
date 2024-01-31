import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
	})
	name: string;

	@Column({
		nullable: false,
		unique: true,
	})
	email: string;

	@Column({
		nullable: false,
	})
	password: string;

	@CreateDateColumn({
		type: 'timestamp',
		default: null,
	})
	createdDate: Date;
}