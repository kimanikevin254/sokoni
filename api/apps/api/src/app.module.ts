import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommonLibModule } from '@app/common-lib';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:pass@localhost'],
          queue: 'user-queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    CommonLibModule,
  ],
  controllers: [AppController, UserController],
  providers: [],
})
export class AppModule {}
