import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'email-verification-token' })
export class EmailVerificationTokenEntity extends BaseEntity {
  @Column({ unique: true, type: 'text' })
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.emailVerificationTokens,
    { onDelete: 'CASCADE' },
  )
  user: UserEntity;
}
