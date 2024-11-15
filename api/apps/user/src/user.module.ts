import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'username',
      password: 'password',
      database: 'sokoni',
      entities: [UserEntity],
      synchronize: true, // Not to be used in prod
    }),
    TypeOrmModule.forFeature([UserEntity]), // Registers the entity in this scope
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
