import { Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IRequest } from '../../interfaces/request.interface';

@Controller(['auth'])
export class AuthController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private extractRequestData(req: IRequest) {
    const { headers, body, params, query } = req;
    return { headers, body, query, params };
  }

  @Post('register')
  register(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'create-user' },
      this.extractRequestData(req),
    );
  }

  @Get('verify-email')
  verifyEmail(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'verify-email' },
      this.extractRequestData(req),
    );
  }

  @Post('login')
  login(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'login-user' },
      this.extractRequestData(req),
    );
  }

  @Post('refresh-tokens')
  refreshToken(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'refresh-tokens' },
      this.extractRequestData(req),
    );
  }

  @Post('logout')
  logout(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'logout' },
      this.extractRequestData(req),
    );
  }

  @Post('change-password')
  changePassword(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'change-password' },
      this.extractRequestData(req),
    );
  }
}
