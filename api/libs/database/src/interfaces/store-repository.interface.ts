import { StoreEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IStoreRepository extends IBaseRepository<StoreEntity> {
  findUserStore(userId: string, storeId: string): Promise<StoreEntity | null>;
  findBySlug(slug: string): Promise<StoreEntity | null>;
}
