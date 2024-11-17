import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  providers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
})
export class ConfigurationModule {}
