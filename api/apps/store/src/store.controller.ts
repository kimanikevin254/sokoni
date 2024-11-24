import { Controller, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { MessagePattern } from '@nestjs/microservices';
import { MsBody } from '@app/common-lib/decorators/ms-body.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from '@app/authentication/guards/auth.guard';
import { UpdateStoreDto } from './dto/update-store.dto';
import { MsParams } from '@app/common-lib/decorators/ms-params.decorator';
import { UpdateStoreParamsDto } from './dto/update-store-params.dto';
import { MsUser } from '@app/common-lib/decorators/ms-user.decorator';
import { IUser } from '@app/common-lib/interfaces/user.interface';
import { AddProductsToStoreDto } from './dto/add-products-to-store.dto';
import { GetStoreProductsParamsDto } from './dto/get-store-product-params.dto';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @MessagePattern({ cmd: 'create-store' })
  @UseGuards(AuthGuard)
  createStore(@MsBody() dto: CreateStoreDto, @MsUser() user: IUser) {
    return this.storeService.createStore(user.id, dto);
  }

  @MessagePattern({ cmd: 'update-store' })
  @UseGuards(AuthGuard)
  updateStore(
    @MsBody() dto: UpdateStoreDto,
    @MsParams() params: UpdateStoreParamsDto,
    @MsUser() user: IUser,
  ) {
    return this.storeService.updateStore(user.id, params, dto);
  }

  @MessagePattern({ cmd: 'my-stores' })
  @UseGuards(AuthGuard)
  myStores(@MsUser() user: IUser) {
    return this.storeService.myStores(user.id);
  }

  @MessagePattern({ cmd: 'add-to-store' })
  @UseGuards(AuthGuard)
  addToStore(@MsUser() user: IUser, @MsBody() dto: AddProductsToStoreDto) {
    return this.storeService.addProductsToStore(user.id, dto);
  }

  @MessagePattern({ cmd: 'get-store-products' })
  storeProducts(@MsParams() dto: GetStoreProductsParamsDto) {
    return this.storeService.getStoreProducts(dto);
  }
}
