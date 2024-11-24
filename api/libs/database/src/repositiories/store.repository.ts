import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { StoreEntity } from '../entities';
import { IStoreRepository } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoreRepository
  extends BaseRepository<StoreEntity>
  implements IStoreRepository
{
  constructor(
    @InjectRepository(StoreEntity)
    repository: Repository<StoreEntity>,
  ) {
    super(repository);
  }

  findUserStore(userId: string, storeId: string): Promise<StoreEntity | null> {
    return this.findOne({
      where: {
        id: storeId,
        owner: { id: userId },
      },
    });
  }

  findBySlug(slug: string): Promise<StoreEntity | null> {
    return this.findOne({ where: { slug } });
  }

  findUserStores(userId: string): Promise<StoreEntity[] | []> {
    return this.find({ where: { owner: { id: userId } } });
  }
}
