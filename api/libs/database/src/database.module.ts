import { ConfigurationModule } from '@app/configuration';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationTokenEntity } from 'apps/user/src/entities/email-verification-token.entity';
import { RefreshTokenEntity } from 'apps/user/src/entities/refresh-token.entity';
import { UserEntity } from 'apps/user/src/entities/user.entity';

@Module({
  providers: [],
  exports: [],
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
          ],
          synchronize: true, // Not to be used in prod
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
