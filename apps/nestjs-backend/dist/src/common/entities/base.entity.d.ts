import { OptionalProps } from '@mikro-orm/core';
export declare abstract class BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';
}
