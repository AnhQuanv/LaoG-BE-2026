import { Exclude } from 'class-transformer';
import { Role } from '../../role/entities/role.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { uuidv7 } from 'uuidv7';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Exclude()
  password!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  fullName?: string;

  @Column({ type: 'varchar', length: 15 })
  phone?: string;

  @Column({ type: 'varchar', length: 255 })
  address?: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive!: boolean;

  @BeforeInsert()
  generateId() {
    // Tự động tạo UUID v7 trước khi Insert
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role!: Role;
}
