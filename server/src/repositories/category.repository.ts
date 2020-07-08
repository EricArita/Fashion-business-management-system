import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Category, CategoryRelations, Contract, Product} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ContractRepository} from './contract.repository';
import {ProductRepository} from './product.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly contracts: HasManyRepositoryFactory<Contract, typeof Category.prototype.id>;

  public readonly products: HasManyRepositoryFactory<Product, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('ContractRepository') protected contractRepositoryGetter: Getter<ContractRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Category, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
    this.contracts = this.createHasManyRepositoryFactoryFor('contracts', contractRepositoryGetter,);
    this.registerInclusionResolver('contracts', this.contracts.inclusionResolver);
  }
}
