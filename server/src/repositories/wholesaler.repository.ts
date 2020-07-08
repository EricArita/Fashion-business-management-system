import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Wholesaler, WholesalerRelations, Order, Contract} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OrderRepository} from './order.repository';
import {ContractRepository} from './contract.repository';

export class WholesalerRepository extends DefaultCrudRepository<
  Wholesaler,
  typeof Wholesaler.prototype.id,
  WholesalerRelations
> {

  public readonly orders: HasManyRepositoryFactory<Order, typeof Wholesaler.prototype.id>;

  public readonly contracts: HasManyRepositoryFactory<Contract, typeof Wholesaler.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('OrderRepository') protected orderRepositoryGetter: Getter<OrderRepository>, @repository.getter('ContractRepository') protected contractRepositoryGetter: Getter<ContractRepository>,
  ) {
    super(Wholesaler, dataSource);
    this.contracts = this.createHasManyRepositoryFactoryFor('contracts', contractRepositoryGetter,);
    this.registerInclusionResolver('contracts', this.contracts.inclusionResolver);
    this.orders = this.createHasManyRepositoryFactoryFor('orders', orderRepositoryGetter,);
    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
  }
}
