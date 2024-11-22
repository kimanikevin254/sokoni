import { RefreshTokenEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IRefreshTokenRepository
  extends IBaseRepository<RefreshTokenEntity> {
  findValidToken(refreshToken: {
    token: string;
    userId: string;
  }): Promise<RefreshTokenEntity | null>;
}
