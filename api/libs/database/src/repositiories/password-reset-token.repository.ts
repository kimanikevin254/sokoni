import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PasswordResetTokenEntity } from '../entities';
import { IPasswordResetTokenRepository } from '../interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class PasswordResetTokenRepository
  extends BaseRepository<PasswordResetTokenEntity>
  implements IPasswordResetTokenRepository
{
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    repository: Repository<PasswordResetTokenEntity>,
  ) {
    super(repository);
  }

  findValidToken(token: string): Promise<PasswordResetTokenEntity> {
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
