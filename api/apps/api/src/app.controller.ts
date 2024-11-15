import { Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Get()
  getHello() {
    return this.userClient.send({ cmd: 'get-users' }, {});
  }

  @Post('auth/register')
  register(@Req() req: Request) {
    return this.userClient.send({ cmd: 'create-user' }, { ...req.body });
  }
}
