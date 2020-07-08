import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Product, ProductRelations, Contract} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ContractRepository} from './contract.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly contracts: HasManyRepositoryFactory<Contract, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('ContractRepository') protected contractRepositoryGetter: Getter<ContractRepository>,
  ) {
    super(Product, dataSource);
    this.contracts = this.createHasManyRepositoryFactoryFor('contracts', contractRepositoryGetter,);
    this.registerInclusionResolver('contracts', this.contracts.inclusionResolver);
  }
}
