import { Controller, Get, Inject, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IRequest } from '../../interfaces/request.interface';

@Controller(['product'])
export class ProductController {
  constructor(
    @Inject('STORE_SERVICE')
    private readonly storeClient: ClientProxy,
  ) {}

  private extractRequestData(req: IRequest) {
    const { headers, body, params, query } = req;
    return { headers, body, query, params };
  }

  @Get()
  products(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'products' },
      this.extractRequestData(req),
    );
  }
}
