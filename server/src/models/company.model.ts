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
export class Company extends Entity {
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
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  address?: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
