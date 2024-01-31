import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
	})
	name: string;

	@Column({
		nullable: false,
	})
	user: string;

	@Column({
		nullable: true,
	})
	description: string;

	@CreateDateColumn({
		type: 'timestamp',
		default: null,
	})
	createdDate: Date;
}
