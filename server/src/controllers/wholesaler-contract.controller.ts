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
  Wholesaler,
  Contract,
} from '../models';
import {WholesalerRepository} from '../repositories';

export class WholesalerContractController {
  constructor(
    @repository(WholesalerRepository) protected wholesalerRepository: WholesalerRepository,
  ) { }

  @get('/wholesalers/{id}/contracts', {
    responses: {
      '200': {
        description: 'Array of Contracts that belong to a specific Wholesaler',
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
    return this.wholesalerRepository.contracts(id).find(filter);
  }

  @post('/wholesalers/{id}/contracts', {
    responses: {
      '200': {
        description: 'Contract model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contract)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Wholesaler.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {
            title: 'NewContractInWholesaler',
            exclude: ['id'],
            optional: ['wholesalerId']
          }),
        },
      },
    }) contract: Omit<Contract, 'id'>,
  ): Promise<Contract> {
    return this.wholesalerRepository.contracts(id).create(contract);
  }

  @patch('/wholesalers/{id}/contracts', {
    responses: {
      '200': {
        description: 'Wholesaler.Contract PATCH success count',
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
    return this.wholesalerRepository.contracts(id).patch(contract, where);
  }

  @del('/wholesalers/{id}/contracts', {
    responses: {
      '200': {
        description: 'Wholesaler.Contract DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Contract)) where?: Where<Contract>,
  ): Promise<Count> {
    return this.wholesalerRepository.contracts(id).delete(where);
  }
}
