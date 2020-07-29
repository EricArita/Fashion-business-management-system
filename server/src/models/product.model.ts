import {Entity, model, property, hasMany} from '@loopback/repository';
import {Contract} from './contract.model';

@model({
  settings: {
    strict: false,
    scope: {
      limit: 10,
    },
    strictObjectIDCoercion: true,
  }
})
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false,
    mongodb: {dataType: 'ObjectId'}
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  categoryId: string;

  @property({
    type: 'string',
    required: true,
  })
  supplierId: string;

  @property({
    type: 'string',
  })
  size?: string;

  @property({
    type: 'number',
  })
  length?: number;

  @property({
    type: 'number',
  })
  width?: number;

  @property({
    type: 'string',
  })
  unit_dimension?: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
  })
  tag?: string;

  @property({
    type: 'string',
  })
  photo?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  created_date?: string;

  @property({
    type: 'string',
  })
  created_by?: string;

  @property({
    type: 'date',
    default: "$now"
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

  @hasMany(() => Contract)
  contracts: Contract[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
