import { StoreProductEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IStoreProductRepository
  extends IBaseRepository<StoreProductEntity> {
  findProductsInStore(
    storeId: string,
    productIds: string[],
  ): Promise<StoreProductEntity[]>;
}
