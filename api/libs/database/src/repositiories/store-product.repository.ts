import { InjectRepository } from '@nestjs/typeorm';
import { StoreProductEntity } from '../entities';
import { IStoreProductRepository } from '../interfaces';
import { BaseRepository } from './base.repository';
import { In, Repository } from 'typeorm';

export class StoreProductRepository
  extends BaseRepository<StoreProductEntity>
  implements IStoreProductRepository
{
  constructor(
    @InjectRepository(StoreProductEntity)
    repository: Repository<StoreProductEntity>,
  ) {
    super(repository);
  }

  findProductsInStore(
    storeId: string,
    productIds: string[],
  ): Promise<StoreProductEntity[]> {
    return this.find(
      {
        store: { id: storeId },
        product: { id: In(productIds) },
      },
      ['store', 'product'],
    );
  }
}
