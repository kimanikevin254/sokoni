import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-users' })
  getUsers() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'create-user' })
  createUser(@Payload() createUserDto: CreateUserDto) {
    throw new RpcException({ statusCode: 401, message: createUserDto });
    // return createUserDto;
    // return this.userService.createUser();
  }
}
