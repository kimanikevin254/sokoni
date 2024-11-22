import { StoreRepository, StoreRepositoryToken } from '@app/database';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { CustomRpcException } from '@app/common-lib/utils/custom-rpc-exception';

@Injectable()
export class StoreService {
  constructor(
    @Inject(StoreRepositoryToken)
    private readonly storeRepository: StoreRepository,
  ) {}

  async createStore(dto: CreateStoreDto) {
    // Make sure slug does not exist in db
    const slugExists = await this.storeRepository.findOne({
      where: { slug: dto.slug },
    });

    if (slugExists) {
      throw new CustomRpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'A store with this slug already exists',
      });
    }

    // Create store
    const newStore = this.storeRepository.create(dto);
    return this.storeRepository.save(newStore);
  }
}
