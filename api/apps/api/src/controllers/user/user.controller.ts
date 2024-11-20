import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IRequest } from '../../interfaces/request.interface';

@Controller(['user'])
export class UserController {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  private extractRequestData(req: IRequest) {
    const { headers, body, params, query } = req;
    return { headers, body, query, params };
  }

  @Get()
  profile(@Req() req: IRequest) {
    return this.userClient.send(
      { cmd: 'user-profile' },
      this.extractRequestData(req),
    );
  }
}
