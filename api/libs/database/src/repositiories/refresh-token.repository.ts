import { Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>,
  ) {}

  create(refreshToken: Partial<RefreshTokenEntity>): RefreshTokenEntity {
    return this.repository.create(refreshToken);
  }

  save(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
    return this.repository.save(refreshToken);
  }

  findToken(
    refreshToken: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity | null> {
    return this.repository.findOne({
      where: {
        token: refreshToken.token,
        user: { id: refreshToken.user.id },
        expiresAt: refreshToken.expiresAt
          ? MoreThanOrEqual(refreshToken.expiresAt)
          : undefined,
      },
      relations: ['user'],
    });
  }

  async update(
    id: string,
    updates: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity> {
    await this.repository.update(id, updates);
    return await this.repository.findOne({
      where: { id },
    });
  }
}
