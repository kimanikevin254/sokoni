import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities';
import { BaseRepository } from './base.repository';

@Injectable()
export class RefreshTokenRepository
  extends BaseRepository<RefreshTokenEntity>
  implements IRefreshTokenRepository
{
  constructor(
    @InjectRepository(RefreshTokenEntity)
    repository: Repository<RefreshTokenEntity>,
  ) {
    super(repository);
  }
  findValidToken(refreshToken: {
    token: string;
    userId: string;
  }): Promise<RefreshTokenEntity | null> {
    return this.repository.findOne({
      where: {
        token: refreshToken.token,
        user: { id: refreshToken.userId },
        expiresAt: MoreThanOrEqual(new Date()),
      },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
  }
}
