import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Company, CompanyRelations, Wholesaler} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {WholesalerRepository} from './wholesaler.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  public readonly wholesalers: HasManyRepositoryFactory<Wholesaler, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('WholesalerRepository') protected wholesalerRepositoryGetter: Getter<WholesalerRepository>,
  ) {
    super(Company, dataSource);
    this.wholesalers = this.createHasManyRepositoryFactoryFor('wholesalers', wholesalerRepositoryGetter,);
    this.registerInclusionResolver('wholesalers', this.wholesalers.inclusionResolver);
  }
}
