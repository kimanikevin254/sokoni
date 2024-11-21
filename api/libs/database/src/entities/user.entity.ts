import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { EmailVerificationTokenEntity } from './email-verification-token.entity';
import { PasswordResetTokenEntity } from './password-reset-token.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  emailVerifiedAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => RefreshTokenEntity,
    (refreshTokenEntity) => refreshTokenEntity.user,
  )
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(
    () => EmailVerificationTokenEntity,
    (refreshTokenEntity) => refreshTokenEntity.user,
  )
  emailVerificationTokens: EmailVerificationTokenEntity[];

  @OneToMany(
    () => PasswordResetTokenEntity,
    (passwordResetTokenEntity) => passwordResetTokenEntity.id,
  )
  passwordResetTokens: PasswordResetTokenEntity[];
}
