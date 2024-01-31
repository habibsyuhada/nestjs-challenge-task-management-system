import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		nullable: false,
	})
	projectId: string;

	@Column()
	name: string;

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
