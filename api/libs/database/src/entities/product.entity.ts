import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { StoreProductEntity } from './store-product.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'product' })
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.products)
  owner: UserEntity;

  @OneToMany(() => StoreProductEntity, (storeProduct) => storeProduct.product)
  storeProducts: StoreProductEntity[];
}
