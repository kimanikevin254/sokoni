import { Module } from '@nestjs/common';
import {
  EmailVerificationTokenRepositoryToken,
  PasswordResetTokenRepositoryToken,
  RefreshTokenRepositoryToken,
  StoreRepositoryToken,
  UserRepositoryToken,
} from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';
import {
  EmailVerificationTokenRepository,
  PasswordResetTokenRepository,
  RefreshTokenRepository,
  StoreRepository,
  UserRepository,
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
    {
      provide: StoreRepositoryToken,
      useClass: StoreRepository,
    },
  ],
  exports: [
    UserRepositoryToken,
    RefreshTokenRepositoryToken,
    EmailVerificationTokenRepositoryToken,
    PasswordResetTokenRepositoryToken,
    StoreRepositoryToken,
  ],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
