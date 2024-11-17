import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule } from '@nestjs/microservices';
import { CommonLibModule } from '@app/common-lib';
import { UserController } from './controllers/user.controller';
import { ConfigurationModule } from '@app/configuration';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigurationModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigurationModule],
        useFactory: (configService: ConfigService) => {
          return {
            options: {
              url: configService.get('config.rmq.uri'),
              queue: [configService.get('config.queues.user')],
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
    CommonLibModule,
  ],
  controllers: [AppController, UserController],
  providers: [],
})
export class AppModule {}
