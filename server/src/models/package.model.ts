import {Entity, model, property, hasMany} from '@loopback/repository';
import {Contract} from './contract.model';

@model({settings: {strict: false}})
export class Package extends Entity {
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
  })
  code?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  formula?: string;

  @property({
    type: 'number',
  })
  sale?: number;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
  })
  description?: string;

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
  })
  deleted?: boolean;

  @hasMany(() => Contract)
  contracts: Contract[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Package>) {
    super(data);
  }
}

export interface PackageRelations {
  // describe navigational properties here
}

export type PackageWithRelations = Package & PackageRelations;
