import {
  IProductRepository,
  IUserRepository,
  ProductRepositoryToken,
  UserRepositoryToken,
} from '@app/database';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import * as slugify from 'slugify';
import { randomBytes } from 'crypto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductParamsDto } from './dto/update-product-params.dto';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';

@Injectable()
export class ProductService {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly productRepository: IProductRepository,
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  // Can be improved for busy environments
  private generateProductSlug(productName: string) {
    // let slug: string;
    // const baseSlug: string = slugify.default(productName);
    // let isSlugUnique: boolean = false;

    // while (!isSlugUnique) {
    //   const randomSuffix = randomBytes(12).toString('hex');
    //   slug = `${baseSlug}-${randomSuffix}`;

    //   //   Check if slug exists in db
    //   const slugExists = await this.productRepository.findBySlug(slug);
    //   isSlugUnique = !slugExists;
    // }

    // return slug;
    const baseSlug: string = slugify.default(productName, {
      lower: true,
      strict: true,
    });
    const randomSuffix = randomBytes(12).toString('hex');
    const slug = `${baseSlug}-${randomSuffix}`;
    return slug;
  }

  async create(userId: string, dto: CreateProductDto) {
    // Retrieve user
    const user = await this.userRepository.findById(userId);

    // Generate product slug
    const slug = this.generateProductSlug(dto.name);

    const newProduct = this.productRepository.create({
      ...dto,
      price: parseInt(dto.price.toFixed(2)),
      slug,
      owner: user,
    });

    const product = await this.productRepository.save(newProduct);

    const { id } = product;

    return { id };
  }

  async update(
    userId: string,
    params: UpdateProductParamsDto,
    dto: UpdateProductDto,
  ) {
    // Retrieve product
    const product = await this.productRepository.findUserProduct(
      userId,
      params.productId,
    );

    if (!product) {
      throw new CustomRpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Product with specified ID does not exist',
      });
    }

    // Update product
    return this.productRepository.update(product.id, dto);
  }

  myProducts(userId: string) {
    return this.productRepository.findUserProducts(userId);
  }
}
