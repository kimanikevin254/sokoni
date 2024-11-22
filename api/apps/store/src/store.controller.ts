import { Controller, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { MessagePattern } from '@nestjs/microservices';
import { MsBody } from '@app/common-lib/decorators/ms-body.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { AuthGuard } from '@app/authentication/guards/auth.guard';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @MessagePattern({ cmd: 'create-store' })
  @UseGuards(AuthGuard)
  createStore(@MsBody() dto: CreateStoreDto) {
    return this.storeService.createStore(dto);
  }
}
