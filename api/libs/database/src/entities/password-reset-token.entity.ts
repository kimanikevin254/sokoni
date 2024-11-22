import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'password-reset-token' })
export class PasswordResetTokenEntity extends BaseEntity {
  @Column({ unique: true, type: 'text' })
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.passwordResetTokens, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
