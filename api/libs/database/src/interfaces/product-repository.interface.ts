import { ProductEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IProductRepository extends IBaseRepository<ProductEntity> {}
