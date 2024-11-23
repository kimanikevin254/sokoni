import {
  StoreRepository,
  StoreRepositoryToken,
  UserRepository,
  UserRepositoryToken,
} from '@app/database';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreParamsDto } from './dto/update-store-params.dto';

@Injectable()
export class StoreService {
  constructor(
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
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
    const { owner, ...rest } = savedStore;

    return rest;
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
}
