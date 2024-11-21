import { ConfigurationModule } from '@app/configuration';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailVerificationTokenEntity,
  PasswordResetTokenEntity,
  RefreshTokenEntity,
  UserEntity,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigService) => {
        return {
          // type: configService.get('config.db.type'),
          type: 'postgres',
          host: configService.get('config.db.host'),
          port: configService.get('config.db.port'),
          username: configService.get('config.db.username'),
          password: configService.get('config.db.password'),
          database: configService.get('config.db.database'),
          entities: [
            UserEntity,
            RefreshTokenEntity,
            EmailVerificationTokenEntity,
            PasswordResetTokenEntity,
          ],
          synchronize: true, // Not to be used in prod
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RefreshTokenEntity,
      EmailVerificationTokenEntity,
      PasswordResetTokenEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class PostgresDataServiceModule {}
