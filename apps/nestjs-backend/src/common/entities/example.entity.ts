import {Entity, Property} from '@mikro-orm/core';
import {BaseEntity} from './base.entity';

@Entity()
export class ExampleEntity extends BaseEntity {
  @Property({length: 120})
  name = 'Example record';
}
