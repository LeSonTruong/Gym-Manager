import { randomUUID } from 'node:crypto';
import { OptionalProps, PrimaryKey, Property, types } from '@mikro-orm/core';

export abstract class BaseEntity {
  @PrimaryKey({ type: types.string, length: 120 })
  id: string = randomUUID();

  @Property({ onCreate: () => new Date(), type: types.datetime, columnType: 'timestamp' })
  createdAt = new Date();

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), type: types.datetime, columnType: 'timestamp' })
  updatedAt = new Date();

  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';
}
