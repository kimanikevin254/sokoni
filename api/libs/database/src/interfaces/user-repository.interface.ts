import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): UserEntity;
  save(user: UserEntity): Promise<UserEntity>;
  update(id: string, updates: Partial<UserEntity>): Promise<UserEntity>;
}
