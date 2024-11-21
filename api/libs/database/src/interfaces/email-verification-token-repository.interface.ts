import { EmailVerificationTokenEntity } from '../entities';

export interface IEmailVerificationTokenRepository {
  create(
    emailVerificationToken: Partial<EmailVerificationTokenEntity>,
  ): EmailVerificationTokenEntity;
  save(
    emailVerificationToken: EmailVerificationTokenEntity,
  ): Promise<EmailVerificationTokenEntity>;
  findValidToken(token: string): Promise<EmailVerificationTokenEntity>;
  update(
    id: string,
    updates: Partial<EmailVerificationTokenEntity>,
  ): Promise<EmailVerificationTokenEntity>;
}
