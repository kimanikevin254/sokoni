import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonLibModule } from '@app/common-lib';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthenticationModule } from '@app/authentication';
import { UserEntity } from '@app/database/entities/user.entity';
import { RefreshTokenEntity } from '@app/database/entities/refresh-token.entity';
import { EmailVerificationTokenEntity } from '@app/database/entities/email-verification-token.entity';

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
