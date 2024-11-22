import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { RefreshTokensDto } from './dto/refresh-tokens.dto';
import { LogOutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@app/authentication/guards/auth.guard';
import { MsBody } from '@app/common-lib/decorators/ms-body.decorator';
import { MsUser } from '@app/common-lib/decorators/ms-user.decorator';
import { IUser } from '@app/common-lib/interfaces/user.interface';
import { MsQuery } from '@app/common-lib/decorators/ms-params.decorator';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create-user' })
  createUser(@MsBody() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern({ cmd: 'verify-email' })
  verifyEmail(@MsQuery() dto: VerifyEmailDto) {
    return this.userService.verifyEmail(dto);
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
  logout(@MsBody() dto: LogOutDto, @MsUser() user: IUser) {
    return this.userService.logOut(dto, user.id);
  }

  @MessagePattern({ cmd: 'change-password' })
  @UseGuards(AuthGuard)
  changePassword(@MsBody() dto: ChangePasswordDto, @MsUser() user: IUser) {
    return this.userService.changePassword(dto, user.id);
  }

  @MessagePattern({ cmd: 'forgot-password' })
  forgotPassword(@MsBody() dto: ForgetPasswordDto) {
    return this.userService.forgotPassword(dto);
  }

  @MessagePattern({ cmd: 'reset-password' })
  resetPassword(@MsBody() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }

  @MessagePattern({ cmd: 'user-profile' })
  @UseGuards(AuthGuard)
  profile(@MsUser() user: IUser) {
    return this.userService.profile(user.id);
  }
}
