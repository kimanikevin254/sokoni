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
}
