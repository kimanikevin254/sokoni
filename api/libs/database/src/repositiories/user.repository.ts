import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

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
    const updatedUser = await this.repository.findOne({ where: { id } });
    return updatedUser;
  }
}
