import {OptionalProps, PrimaryKey, Property, types} from '@mikro-orm/core';
import {v4 as uuidv4} from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({type: types.string, length: 120})
  id = uuidv4();

  @Property({onCreate: () => new Date(), type: types.datetime, columnType: 'timestamp'})
  createdAt = new Date();

  @Property({onCreate: () => new Date(), onUpdate: () => new Date(), type: types.datetime, columnType: 'timestamp'})
  updatedAt = new Date();

  [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';
}
