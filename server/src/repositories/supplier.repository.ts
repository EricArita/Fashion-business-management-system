import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Supplier, SupplierRelations, Product} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';

export class SupplierRepository extends DefaultCrudRepository<
  Supplier,
  typeof Supplier.prototype.id,
  SupplierRelations
> {

  public readonly products: HasManyRepositoryFactory<Product, typeof Supplier.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Supplier, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
