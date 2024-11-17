import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { LogOutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@app/common-lib/guards/auth.guard';
import { MsBody } from '@app/common-lib/decorators/ms-body.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create-user' })
  createUser(@MsBody() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: 'login-user' })
  login(@MsBody() loginDto: LogInDto) {
    return this.userService.login(loginDto);
  }

  @MessagePattern({ cmd: 'refresh-tokens' })
  refreshTokens(@MsBody() dto: RefreshTokensDto) {
    return this.userService.refreshTokens(dto);
  }

  @MessagePattern({ cmd: 'logout' })
  @UseGuards(AuthGuard)
  logout(@MsBody() dto: LogOutDto) {
    return this.userService.logOut(dto);
  }

  @MessagePattern({ cmd: 'change-password' })
  changePassword(@MsBody() dto: ChangePasswordDto) {
    return this.userService.changePassword(dto, 'str');
  }
}
