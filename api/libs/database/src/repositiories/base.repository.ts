import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import { IBaseRepository } from '../interfaces';

export class BaseRepository<T> implements IBaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  create(entity: DeepPartial<T>): T {
    return this.repository.create(entity);
  }

  createMany(entity: DeepPartial<T>[]): T[] {
    return this.repository.create(entity) as T[];
  }

  save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  saveMany(entity: T[]): Promise<T[]> {
    return this.repository.save(entity) as Promise<T[]>;
  }

  findOne(where: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(where);
  }

  // find(where: FindOptionsWhere<T>, relations?: string[]): Promise<T[]> {
  //   return this.repository.find({ where, relations });
  // }
  find(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  findAll(relations?: string[]): Promise<T[]> {
    return this.repository.find({ relations });
  }

  findById(id: string): Promise<T> {
    return this.findOne({ where: { id } as { id: any } });
  }

  findByIds(ids: string[]): Promise<[] | T[]> {
    return this.find({ where: { id: In(ids) } as { id: any } });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  // as any is a temporary fix that seems to be working here
  async update(id: string, updates: Partial<T>): Promise<T> {
    await this.repository.update(id, updates as any);

    return this.findOne({ where: { id } as { id: any } });
  }
}
