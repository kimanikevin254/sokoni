import { Column, Entity, OneToMany } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { EmailVerificationTokenEntity } from './email-verification-token.entity';
import { PasswordResetTokenEntity } from './password-reset-token.entity';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'text' })
  passwordHash: string;

  @Column({ nullable: true, type: 'timestamptz' })
  emailVerifiedAt?: Date | null;

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
    (passwordResetTokenEntity) => passwordResetTokenEntity.user,
  )
  passwordResetTokens: PasswordResetTokenEntity[];

  @OneToMany(() => StoreEntity, (storeEntity) => storeEntity.owner)
  stores: StoreEntity[];

  @OneToMany(() => ProductEntity, (productEntity) => productEntity.owner)
  products: StoreEntity[];
}
