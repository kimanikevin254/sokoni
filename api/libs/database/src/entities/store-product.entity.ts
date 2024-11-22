import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreEntity } from './store.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'store-product' })
export class StoreProductEntity extends BaseEntity {
  @ManyToOne(() => StoreEntity, (store) => store.storeProducts, {
    onDelete: 'CASCADE',
  })
  store: StoreEntity;

  @ManyToOne(() => ProductEntity, (product) => product.storeProducts, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;

  @Column({ type: 'integer', default: 0 })
  stock: number; // Stock specific to this store

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  addedAt: Date; // When the product was added to the store
}
