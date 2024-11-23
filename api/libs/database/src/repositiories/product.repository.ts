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
}
