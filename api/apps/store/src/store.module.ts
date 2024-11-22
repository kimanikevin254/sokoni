import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { AuthenticationModule } from '@app/authentication';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    AuthenticationModule,
    ProductModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
