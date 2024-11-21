import { Module } from '@nestjs/common';
import { UserRepository } from './repositiories/user.repository';
import {
  IRefreshTokenRepositoryToken,
  IUserRepositoryToken,
} from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';
import { RefreshTokenRepository } from './repositiories';

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
  ],
  exports: [IUserRepositoryToken, IRefreshTokenRepositoryToken],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
