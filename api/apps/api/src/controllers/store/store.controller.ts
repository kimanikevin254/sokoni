import { Controller, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IRequest } from '../../interfaces/request.interface';

@Controller(['store'])
export class StoreController {
  constructor(
    @Inject('STORE_SERVICE')
    private readonly storeClient: ClientProxy,
  ) {}

  private extractRequestData(req: IRequest) {
    const { headers, body, params, query } = req;
    return { headers, body, query, params };
  }

  @Post()
  createStore(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'create-store' },
      this.extractRequestData(req),
    );
  }
}