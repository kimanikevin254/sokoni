import { AuthGuard } from '@app/authentication/guards/auth.guard';
import { MsBody } from '@app/common-lib/decorators/ms-body.decorator';
import { Controller, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { MsUser } from '@app/common-lib/decorators/ms-user.decorator';
import { IUser } from '@app/common-lib/interfaces/user.interface';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { MsParams } from '@app/common-lib/decorators/ms-params.decorator';
import { UpdateProductParamsDto } from './dto/update-product-params.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'create-product' })
  @UseGuards(AuthGuard)
  createProduct(@MsBody() dto: CreateProductDto, @MsUser() user: IUser) {
    return this.productService.create(user.id, dto);
  }

  @MessagePattern({ cmd: 'update-product' })
  @UseGuards(AuthGuard)
  updateProduct(
    @MsBody() dto: UpdateProductDto,
    @MsParams() params: UpdateProductParamsDto,
    @MsUser() user: IUser,
  ) {
    return this.productService.update(user.id, params, dto);
  }
}
