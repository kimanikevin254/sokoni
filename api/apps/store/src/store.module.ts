import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { AuthenticationModule } from '@app/authentication';

@Module({
  imports: [ConfigurationModule, DatabaseModule, AuthenticationModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
