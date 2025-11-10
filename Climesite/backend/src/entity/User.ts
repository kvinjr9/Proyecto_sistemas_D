import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity({ name: "usuarios" })
@Unique(["correo"])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  ciudad!: string;

  @Column()
  estado!: string;

  @Column()
  correo!: string;

  @Column()
  clave!: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt!: Date;
}
