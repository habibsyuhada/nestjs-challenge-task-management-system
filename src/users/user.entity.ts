import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

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
  created_date: Date;
}