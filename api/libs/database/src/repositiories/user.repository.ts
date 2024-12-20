import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { IUserRepository } from '../interfaces';
import { BaseRepository } from './base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ where: { email } });
  }
}
