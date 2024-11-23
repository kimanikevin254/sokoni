import { ProductEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IProductRepository extends IBaseRepository<ProductEntity> {
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findUserProduct(
    userId: string,
    productId: string,
  ): Promise<ProductEntity | null>;
}
