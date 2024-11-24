import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../entities';
import { IProductRepository } from '../interfaces';
import { BaseRepository } from './base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository
  extends BaseRepository<ProductEntity>
  implements IProductRepository
{
  constructor(
    @InjectRepository(ProductEntity)
    repository: Repository<ProductEntity>,
  ) {
    super(repository);
  }

  findBySlug(slug: string): Promise<ProductEntity | null> {
    return this.findOne({ where: { slug } });
  }

  findUserProduct(
    userId: string,
    productId: string,
  ): Promise<ProductEntity | null> {
    return this.findOne({
      where: {
        id: productId,
        owner: { id: userId },
      },
    });
  }

  findUserProducts(userId: string): Promise<ProductEntity[] | [null]> {
    return this.find({ where: { owner: { id: userId } } });
  }
}
