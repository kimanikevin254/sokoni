import { PasswordResetTokenEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IPasswordResetTokenRepository
  extends IBaseRepository<PasswordResetTokenEntity> {
  findValidToken(token: string): Promise<PasswordResetTokenEntity | null>;
}
