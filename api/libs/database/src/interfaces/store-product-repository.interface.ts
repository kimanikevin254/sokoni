import { ProductEntity, StoreProductEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IStoreProductRepository
  extends IBaseRepository<StoreProductEntity> {
  findStoreProductsByIds(
    storeId: string,
    productIds: string[],
  ): Promise<StoreProductEntity[]>;

  findStoreProducts(storeId: string): Promise<ProductEntity[]>;
}
