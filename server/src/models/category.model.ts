import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    scope: {
      limit: 10,
    },
    strictObjectIDCoercion: true,
  }
})
export class Category extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: true,
    mongodb: {dataType: 'ObjectId'}
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  tag?: string;

  @property({
    type: 'date',
  })
  created_date?: string;

  @property({
    type: 'string',
  })
  created_by?: string;

  @property({
    type: 'date',
  })
  updated_date?: string;

  @property({
    type: 'string',
  })
  updated_by?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  deleted?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  // describe navigational properties here
}

export type CategoryWithRelations = Category & CategoryRelations;
