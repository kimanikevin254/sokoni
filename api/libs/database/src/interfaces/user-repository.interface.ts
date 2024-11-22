import { UserEntity } from '../entities';
import { IBaseRepository } from './base-repository.interface';

export interface IUserRepository extends IBaseRepository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}
