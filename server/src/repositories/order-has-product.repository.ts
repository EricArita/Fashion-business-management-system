import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {OrderHasProduct, OrderHasProductRelations, Product, Order} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';
import {OrderRepository} from './order.repository';

export class OrderHasProductRepository extends DefaultCrudRepository<
  OrderHasProduct,
  typeof OrderHasProduct.prototype.id,
  OrderHasProductRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof OrderHasProduct.prototype.id>;

  public readonly order: BelongsToAccessor<Order, typeof OrderHasProduct.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('OrderRepository') protected orderRepositoryGetter: Getter<OrderRepository>,
  ) {
    super(OrderHasProduct, dataSource);
    this.order = this.createBelongsToAccessorFor('order', orderRepositoryGetter,);
    this.registerInclusionResolver('order', this.order.inclusionResolver);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
