import { Module } from '@nestjs/common';
import { UserRepository } from './repositiories/user.repository';
import { IUserRepositoryToken } from './constants';
import { PostgresDataServiceModule } from './postgres-dataservice.module';

@Module({
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
  ],
  exports: [IUserRepositoryToken],
  imports: [PostgresDataServiceModule],
})
export class DatabaseModule {}
