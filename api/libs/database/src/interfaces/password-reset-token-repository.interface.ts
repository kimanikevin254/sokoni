import { PasswordResetTokenEntity } from '../entities';

export interface IPasswordResetTokenRepository {
  create(
    passwordResetToken: Partial<PasswordResetTokenEntity>,
  ): PasswordResetTokenEntity;
  save(
    passwordResetToken: PasswordResetTokenEntity,
  ): Promise<PasswordResetTokenEntity>;
  findValidToken(token: string): Promise<PasswordResetTokenEntity | null>;
  update(
    id: string,
    updates: Partial<PasswordResetTokenEntity>,
  ): Promise<PasswordResetTokenEntity>;
}
