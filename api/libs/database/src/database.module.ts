import { Global, Module } from '@nestjs/common';
import {
  EmailVerificationTokenRepositoryToken,
  PasswordResetTokenRepositoryToken,
  ProductRepositoryToken,
  RefreshTokenRepositoryToken,
  StoreRepositoryToken,
  UserRepositoryToken,
} from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';
import {
  EmailVerificationTokenRepository,
  PasswordResetTokenRepository,
  ProductRepository,
  RefreshTokenRepository,
  StoreRepository,
  UserRepository,
} from './repositiories';

@Global()
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
    {
      provide: ProductRepositoryToken,
      useClass: ProductRepository,
    },
  ],
  exports: [
    UserRepositoryToken,
    RefreshTokenRepositoryToken,
    EmailVerificationTokenRepositoryToken,
    PasswordResetTokenRepositoryToken,
    StoreRepositoryToken,
    ProductRepositoryToken,
  ],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
