import { Global, Module } from '@nestjs/common';
import {
  EmailVerificationTokenRepositoryToken,
  PasswordResetTokenRepositoryToken,
  ProductRepositoryToken,
  RefreshTokenRepositoryToken,
  StoreProductRepositoryToken,
  StoreRepositoryToken,
  UserRepositoryToken,
} from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';
import {
  EmailVerificationTokenRepository,
  PasswordResetTokenRepository,
  ProductRepository,
  RefreshTokenRepository,
  StoreProductRepository,
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
    {
      provide: StoreProductRepositoryToken,
      useClass: StoreProductRepository,
    },
  ],
  exports: [
    UserRepositoryToken,
    RefreshTokenRepositoryToken,
    EmailVerificationTokenRepositoryToken,
    PasswordResetTokenRepositoryToken,
    StoreRepositoryToken,
    ProductRepositoryToken,
    StoreProductRepositoryToken,
  ],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
