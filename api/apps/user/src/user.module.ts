import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CommonLibModule } from '@app/common-lib';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'username',
      password: 'password',
      database: 'sokoni',
      entities: [UserEntity, RefreshTokenEntity],
      synchronize: true, // Not to be used in prod
    }),
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
