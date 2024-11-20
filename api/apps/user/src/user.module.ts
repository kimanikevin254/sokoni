import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CommonLibModule } from '@app/common-lib';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationTokenEntity } from './entities/email-verification-token.entity';
import { AuthenticationModule } from '@app/authentication';

@Module({
  imports: [
    ConfigurationModule,
    AuthenticationModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      EmailVerificationTokenEntity,
    ]), // Registers the entity in this scope
    CommonLibModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        imports: [ConfigurationModule],
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get('config.rmq.uri') as string],
              queue: configService.get('config.queues.notification'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
