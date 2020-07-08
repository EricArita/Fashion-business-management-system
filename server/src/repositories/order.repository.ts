import {DefaultCrudRepository} from '@loopback/repository';
import {Order, OrderRelations} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource,
  ) {
    super(Order, dataSource);
  }
}
