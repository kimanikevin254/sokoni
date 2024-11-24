import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity, StoreProductEntity } from '../entities';
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

  findStoreProductsByIds(
    storeId: string,
    productIds: string[],
  ): Promise<StoreProductEntity[]> {
    return this.find({
      where: {
        store: { id: storeId },
        product: { id: In(productIds) },
      },
      relations: ['store', 'product'],
    });
  }

  async findStoreProducts(storeId: string): Promise<ProductEntity[]> {
    const storeProducts = await this.find({
      where: { store: { id: storeId } },
      relations: ['product'],
    });

    return storeProducts.map((sp) => sp.product);
  }
}
