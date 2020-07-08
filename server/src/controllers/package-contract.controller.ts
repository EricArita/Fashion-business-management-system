import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Package,
  Contract,
} from '../models';
import {PackageRepository} from '../repositories';

export class PackageContractController {
  constructor(
    @repository(PackageRepository) protected packageRepository: PackageRepository,
  ) { }

  @get('/packages/{id}/contracts', {
    responses: {
      '200': {
        description: 'Array of Package has many Contract',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Contract)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Contract>,
  ): Promise<Contract[]> {
    return this.packageRepository.contracts(id).find(filter);
  }

  @post('/packages/{id}/contracts', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contract)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Package.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {
            title: 'NewContractInPackage',
            exclude: ['id'],
            optional: ['packageId']
          }),
        },
      },
    }) contract: Omit<Contract, 'id'>,
  ): Promise<Contract> {
    return this.packageRepository.contracts(id).create(contract);
  }

  @patch('/packages/{id}/contracts', {
    responses: {
      '200': {
        description: 'Package.Contract PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {partial: true}),
        },
      },
    })
    contract: Partial<Contract>,
    @param.query.object('where', getWhereSchemaFor(Contract)) where?: Where<Contract>,
  ): Promise<Count> {
    return this.packageRepository.contracts(id).patch(contract, where);
  }

  @del('/packages/{id}/contracts', {
    responses: {
      '200': {
        description: 'Package.Contract DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Contract)) where?: Where<Contract>,
  ): Promise<Count> {
    return this.packageRepository.contracts(id).delete(where);
  }
}
