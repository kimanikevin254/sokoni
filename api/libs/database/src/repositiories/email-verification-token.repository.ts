import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { EmailVerificationTokenEntity } from '../entities';
import { IEmailVerificationTokenRepository } from '../interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class EmailVerificationTokenRepository
  extends BaseRepository<EmailVerificationTokenEntity>
  implements IEmailVerificationTokenRepository
{
  constructor(
    @InjectRepository(EmailVerificationTokenEntity)
    repository: Repository<EmailVerificationTokenEntity>,
  ) {
    super(repository);
  }

  findValidToken(token: string): Promise<EmailVerificationTokenEntity> {
    return this.findOne({
      where: { token, expiresAt: MoreThanOrEqual(new Date()) },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
  }
}
