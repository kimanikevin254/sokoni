import {
  DeepPartial,
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';

export interface IBaseRepository<T> {
  create(entity: DeepPartial<T>): T;
  createMany(entity: DeepPartial<T>[]): T[];
  save(entity: T): Promise<T>;
  saveMany(entity: T[]): Promise<T[]>;
  findOne(where: FindOneOptions<T>): Promise<T | null>;
  find(where: FindOptionsWhere<T>, relations?: string[]): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  findByIds(ids: string[]): Promise<T[] | []>;
  findAll(relations?: string[]): Promise<T[]>;
  delete(id: string): Promise<DeleteResult>;
  update(id: string, updates: Partial<T>): Promise<T>;
}
