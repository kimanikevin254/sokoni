import {
  IProductRepository,
  IStoreProductRepository,
  IStoreRepository,
  IUserRepository,
  ProductRepositoryToken,
  StoreProductRepositoryToken,
  StoreRepositoryToken,
  UserRepositoryToken,
} from '@app/database';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreParamsDto } from './dto/update-store-params.dto';
import { AddProductsToStoreDto } from './dto/add-products-to-store.dto';
import { GetStoreProductsParamsDto } from './dto/get-store-product-params.dto';

@Injectable()
export class StoreService {
  constructor(
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: IStoreRepository,
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(StoreProductRepositoryToken)
    private readonly storeProductRepository: IStoreProductRepository,
    @Inject(ProductRepositoryToken)
    private readonly productRepository: IProductRepository,
  ) {}

  async createStore(userId: string, dto: CreateStoreDto) {
    // Make sure slug does not exist in db
    const slugExists = await this.storeRepository.findBySlug(dto.slug);

    if (slugExists) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'A store with this slug already exists',
      });
    }

    // Retrieve user
    const user = await this.userRepository.findById(userId);

    // Create store
    const newStore = this.storeRepository.create({
      ...dto,
      owner: user,
    });

    const savedStore = await this.storeRepository.save(newStore);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { owner, ...rest } = savedStore;

    return savedStore;
  }

  async updateStore(
    userId: string,
    params: UpdateStoreParamsDto,
    dto: UpdateStoreDto,
  ) {
    // Retrieve store
    const store = await this.storeRepository.findUserStore(
      userId,
      params.storeId,
    );

    if (!store) {
      throw new CustomRpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Store with specified ID does not exist',
      });
    }

    await this.storeRepository.update(store.id, dto);
  }

  myStores(userId: string) {
    return this.storeRepository.findUserStores(userId);
  }

  async addProductsToStore(userId: string, dto: AddProductsToStoreDto) {
    const store = await this.storeRepository.findUserStore(userId, dto.storeId);

    if (!store) {
      throw new CustomRpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Store with the provided ID does not exist',
      });
    }

    const productIds = dto.products.map((p) => p.productId);

    // Fetch existing store-product r/ships
    const existingStoreProducts =
      await this.storeProductRepository.findStoreProductsByIds(
        dto.storeId,
        productIds,
      );

    // Extract ids of products already in store
    const existingProductIds = existingStoreProducts.map((sp) => sp.product.id);

    // Filter out products already in store
    const productsToAdd = productIds.filter(
      (id) => !existingProductIds.includes(id),
    );

    if (productsToAdd.length === 0) {
      return {
        message:
          'No new products were added. All specified products already exist in store.',
      };
    }

    // Fetch product details of products to add
    const products = await this.productRepository.findByIds(productsToAdd);

    // Format data for saving
    const formattedData = products.map((p) => ({
      product: p,
      store,
      stock: dto.products.find((dtoP) => dtoP.productId === p.id).stock,
    }));

    const addedProducts = this.storeProductRepository.createMany(formattedData);
    await this.storeProductRepository.saveMany(addedProducts);

    return {
      message: `${productsToAdd.length} product(s) successfully added to the store`,
    };
  }

  async getStoreProducts(dto: GetStoreProductsParamsDto) {
    // Make sure store exists
    const store = await this.storeRepository.findById(dto.storeId);

    if (!store) {
      throw new CustomRpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Store with the specified ID does not exist',
      });
    }

    return this.storeProductRepository.findStoreProducts(dto.storeId);
  }
}
