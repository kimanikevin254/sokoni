import { EmailVerificationTokenEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IEmailVerificationTokenRepository
  extends IBaseRepository<EmailVerificationTokenEntity> {
  findValidToken(token: string): Promise<EmailVerificationTokenEntity | null>;
}
