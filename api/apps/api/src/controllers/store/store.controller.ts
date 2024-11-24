import { Controller, Get, Inject, Patch, Post, Req } from '@nestjs/common';
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

  @Patch(':storeId')
  updateStore(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'update-store' },
      this.extractRequestData(req),
    );
  }

  @Get('my-stores')
  myStores(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'my-stores' },
      this.extractRequestData(req),
    );
  }

  @Post('add-products')
  addProducts(@Req() req: IRequest) {
    return this.storeClient.send(
      { cmd: 'add-to-store' },
      this.extractRequestData(req),
    );
  }
}
