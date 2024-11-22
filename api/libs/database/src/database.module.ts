import { Module } from '@nestjs/common';
import { UserRepository } from './repositiories/user.repository';
import {
  EmailVerificationTokenRepositoryToken,
  PasswordResetTokenRepositoryToken,
  RefreshTokenRepositoryToken,
  UserRepositoryToken,
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
      provide: UserRepositoryToken,
      useClass: UserRepository,
    },
    {
      provide: RefreshTokenRepositoryToken,
      useClass: RefreshTokenRepository,
    },
    {
      provide: EmailVerificationTokenRepositoryToken,
      useClass: EmailVerificationTokenRepository,
    },
    {
      provide: PasswordResetTokenRepositoryToken,
      useClass: PasswordResetTokenRepository,
    },
  ],
  exports: [
    UserRepositoryToken,
    RefreshTokenRepositoryToken,
    EmailVerificationTokenRepositoryToken,
    PasswordResetTokenRepositoryToken,
  ],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
