import { Module } from '@nestjs/common';
import { UserRepository } from './repositiories/user.repository';
import {
  IEmailVerificationTokenRepositoryToken,
  IPasswordResetTokenRepositoryToken,
  IRefreshTokenRepositoryToken,
  IUserRepositoryToken,
} from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';
import {
  EmailVerificationTokenRepository,
  PasswordResetTokenRepository,
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
    {
      provide: IPasswordResetTokenRepositoryToken,
      useClass: PasswordResetTokenRepository,
    },
  ],
  exports: [
    IUserRepositoryToken,
    IRefreshTokenRepositoryToken,
    IEmailVerificationTokenRepositoryToken,
    IPasswordResetTokenRepositoryToken,
  ],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
