import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'refresh-token' })
export class RefreshTokenEntity extends BaseEntity {
  @Column({ unique: true, type: 'text' })
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.refreshTokens, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
