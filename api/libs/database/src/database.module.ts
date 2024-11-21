import { Module } from '@nestjs/common';
import { UserRepository } from './repositiories/user.repository';
import {
  IEmailVerificationTokenRepositoryToken,
  IRefreshTokenRepositoryToken,
  IUserRepositoryToken,
} from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';
import {
  EmailVerificationTokenRepository,
  RefreshTokenRepository,
} from './repositiories';

@Module({
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
    {
      provide: IRefreshTokenRepositoryToken,
      useClass: RefreshTokenRepository,
    },
    {
      provide: IEmailVerificationTokenRepositoryToken,
      useClass: EmailVerificationTokenRepository,
    },
  ],
  exports: [
    IUserRepositoryToken,
    IRefreshTokenRepositoryToken,
    IEmailVerificationTokenRepositoryToken,
  ],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
