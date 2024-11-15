import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common-lib';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-users' })
  getUsers() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'create-user' })
  createUser(@Payload() createUserDto: CreateUserDto) {
    throw new RpcException(createUserDto);
    // return createUserDto;
    // return this.userService.createUser();
  }
}
