import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Package, PackageRelations, Contract} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ContractRepository} from './contract.repository';

export class PackageRepository extends DefaultCrudRepository<
  Package,
  typeof Package.prototype.id,
  PackageRelations
> {

  public readonly contracts: HasManyRepositoryFactory<Contract, typeof Package.prototype.id>;

  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource, @repository.getter('ContractRepository') protected contractRepositoryGetter: Getter<ContractRepository>,
  ) {
    super(Package, dataSource);
    this.contracts = this.createHasManyRepositoryFactoryFor('contracts', contractRepositoryGetter,);
    this.registerInclusionResolver('contracts', this.contracts.inclusionResolver);
  }
}
