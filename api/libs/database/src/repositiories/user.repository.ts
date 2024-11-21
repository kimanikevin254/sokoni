import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { IUserRepository } from '../interfaces';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  create(user: Partial<UserEntity>): UserEntity {
    return this.repository.create(user);
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async update(id: string, updates: Partial<UserEntity>): Promise<UserEntity> {
    await this.repository.update(id, updates);
    return await this.repository.findOne({ where: { id } });
  }
}
