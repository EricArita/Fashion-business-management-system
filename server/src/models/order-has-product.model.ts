import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Product} from './product.model';
import {Order} from './order.model';

@model({settings: {strict: false}})
export class OrderHasProduct extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    required: false,
    mongodb: {dataType: 'ObjectId'}
  })
  id?: string;
  
  @belongsTo(() => Product)
  productId: string;

  @belongsTo(() => Order)
  orderId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderHasProduct>) {
    super(data);
  }
}

export interface OrderHasProductRelations {
  // describe navigational properties here
}

export type OrderHasProductWithRelations = OrderHasProduct & OrderHasProductRelations;
