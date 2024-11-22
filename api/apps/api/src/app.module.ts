import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonLibModule } from '@app/common-lib';
import { UserController } from './controllers/user/user.controller';
import { ConfigurationModule } from '@app/configuration';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/user/auth.controller';
import { StoreController } from './controllers/store/store.controller';

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigurationModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('config.rmq.uri') as string],
              queue: configService.get('config.queues.user'),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'STORE_SERVICE',
        imports: [ConfigurationModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('config.rmq.uri') as string],
              queue: configService.get('config.queues.store'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    CommonLibModule,
  ],
  controllers: [AppController, AuthController, UserController, StoreController],
  providers: [],
})
export class AppModule {}
