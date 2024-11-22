import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'store' })
export class StoreEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bannerUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteUrl?: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isVirtual: boolean;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.stores, {
    onDelete: 'CASCADE',
  })
  owner: UserEntity;
}
