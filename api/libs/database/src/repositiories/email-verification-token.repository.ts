import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { EmailVerificationTokenEntity } from '../entities';
import { IEmailVerificationTokenRepository } from '../interfaces';

@Injectable()
export class EmailVerificationTokenRepository
  implements IEmailVerificationTokenRepository
{
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    private readonly repository: Repository<EmailVerificationTokenEntity>,
  ) {}

  create(
    emailVerificationToken: Partial<EmailVerificationTokenEntity>,
  ): EmailVerificationTokenEntity {
    return this.repository.create(emailVerificationToken);
  }

  save(
    emailVerificationToken: EmailVerificationTokenEntity,
  ): Promise<EmailVerificationTokenEntity> {
    return this.repository.save(emailVerificationToken);
  }

  findValidToken(token: string): Promise<EmailVerificationTokenEntity> {
    return this.repository.findOne({
      where: { token, expiresAt: MoreThanOrEqual(new Date()) },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
  }

  async update(
    id: string,
    updates: Partial<EmailVerificationTokenEntity>,
  ): Promise<EmailVerificationTokenEntity> {
    await this.repository.update(id, updates);
    return await this.repository.findOne({
      where: { id },
    });
  }
}
