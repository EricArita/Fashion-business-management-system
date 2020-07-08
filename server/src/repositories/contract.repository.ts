import {DefaultCrudRepository} from '@loopback/repository';
import {Contract, ContractRelations} from '../models';
import {DbTkpmDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ContractRepository extends DefaultCrudRepository<
  Contract,
  typeof Contract.prototype.id,
  ContractRelations
> {
  constructor(
    @inject('datasources.dbTKPM') dataSource: DbTkpmDataSource,
  ) {
    super(Contract, dataSource);
  }
}
