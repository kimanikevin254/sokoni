import { RefreshTokenEntity } from '../entities';

export interface IRefreshTokenRepository {
  create(refreshToken: Partial<RefreshTokenEntity>): RefreshTokenEntity;
  save(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;
  findValidToken(
    refreshToken: Partial<{
      token: string;
      userId: string;
    }>,
  ): Promise<RefreshTokenEntity | null>;
  update(
    id: string,
    updates: Partial<RefreshTokenEntity>,
  ): Promise<RefreshTokenEntity>;
}
