import { AuthGuard } from '@app/authentication/guards/auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  @MessagePattern({ cmd: 'products' })
  @UseGuards(AuthGuard)
  products() {
    return { products: [] };
  }
}
