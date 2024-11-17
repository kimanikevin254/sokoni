import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CommonLibModule } from '@app/common-lib';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { ConfigurationModule } from '@app/configuration';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]), // Registers the entity in this scope
    CommonLibModule,
    JwtModule.register({
      global: true,
      secret: 'Supersecret123!',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
