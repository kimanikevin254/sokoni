import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PasswordResetTokenEntity } from '../entities';
import { IPasswordResetTokenRepository } from '../interfaces';

@Injectable()
export class PasswordResetTokenRepository
  implements IPasswordResetTokenRepository
{
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly repository: Repository<PasswordResetTokenEntity>,
  ) {}

  create(
    passwordResetToken: Partial<PasswordResetTokenEntity>,
  ): PasswordResetTokenEntity {
    return this.repository.create(passwordResetToken);
  }

  save(
    passwordResetToken: PasswordResetTokenEntity,
  ): Promise<PasswordResetTokenEntity> {
    return this.repository.save(passwordResetToken);
  }

  findValidToken(token: string): Promise<PasswordResetTokenEntity> {
    return this.repository.findOne({
      where: { token, expiresAt: MoreThanOrEqual(new Date()) },
      relations: ['user'],
      select: {
        user: {
          id: true,
        },
      },
    });
  }

  async update(
    id: string,
    updates: Partial<PasswordResetTokenEntity>,
  ): Promise<PasswordResetTokenEntity> {
    await this.repository.update(id, updates);
    return await this.repository.findOne({
      where: { id },
    });
  }
}
