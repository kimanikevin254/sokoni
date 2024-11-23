import { Controller, Get, Inject, Patch, Post, Req } from '@nestjs/common';
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

  @Post()
  create(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'create-product' },
      this.extractRequestData(req),
    );
  }

  @Patch(':productId')
  update(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'update-product' },
      this.extractRequestData(req),
    );
  }

  @Get('my-products')
  myProducts(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'my-products' },
      this.extractRequestData(req),
    );
  }
}
