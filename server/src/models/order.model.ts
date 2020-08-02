import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strict: false,
    strictObjectIDCoercion: true,
  }
})
export class Order extends Entity {
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
  wholesalerId?: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'number',
  })
  discount?: number;

  @property({
    type: 'string',
  })
  currency?: string;

  @property({
    type: 'string',
  })
  order_status?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  export_date?: string;

  @property({
    type: 'string',
  })
  export_by?: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;
