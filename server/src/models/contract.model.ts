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
export class Contract extends Entity {
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
  })
  wholesalerId?: string;

  @property({
    type: 'string',
  })
  categoryId?: string;

  @property({
    type: 'string',
  })
  productId?: string;

  @property({
    type: 'string',
  })
  packageId?: string;

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

  constructor(data?: Partial<Contract>) {
    super(data);
  }
}

export interface ContractRelations {
  // describe navigational properties here
}

export type ContractWithRelations = Contract & ContractRelations;
