import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Contract} from '../models';
import {ContractRepository} from '../repositories';

export class ContractController {
  constructor(
    @repository(ContractRepository)
    public contractRepository : ContractRepository,
  ) {}

  @post('/contracts', {
    responses: {
      '200': {
        description: 'Contract model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contract)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {
            title: 'NewContract',
            exclude: ['id'],
          }),
        },
      },
    })
    contract: Omit<Contract, 'id'>,
  ): Promise<Contract> {
    return this.contractRepository.create(contract);
  }

  @get('/contracts/count', {
    responses: {
      '200': {
        description: 'Contract model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Contract) where?: Where<Contract>,
  ): Promise<Count> {
    return this.contractRepository.count(where);
  }

  @get('/contracts', {
    responses: {
      '200': {
        description: 'Array of Contract model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Contract, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Contract) filter?: Filter<Contract>,
  ): Promise<Contract[]> {
    return this.contractRepository.find(filter);
  }

  @patch('/contracts', {
    responses: {
      '200': {
        description: 'Contract PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {partial: true}),
        },
      },
    })
    contract: Contract,
    @param.where(Contract) where?: Where<Contract>,
  ): Promise<Count> {
    return this.contractRepository.updateAll(contract, where);
  }

  @get('/contracts/{id}', {
    responses: {
      '200': {
        description: 'Contract model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Contract, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Contract, {exclude: 'where'}) filter?: FilterExcludingWhere<Contract>
  ): Promise<Contract> {
    return this.contractRepository.findById(id, filter);
  }

  @patch('/contracts/{id}', {
    responses: {
      '204': {
        description: 'Contract PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {partial: true}),
        },
      },
    })
    contract: Contract,
  ): Promise<void> {
    await this.contractRepository.updateById(id, contract);
  }

  @put('/contracts/{id}', {
    responses: {
      '204': {
        description: 'Contract PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() contract: Contract,
  ): Promise<void> {
    await this.contractRepository.replaceById(id, contract);
  }

  @del('/contracts/{id}', {
    responses: {
      '204': {
        description: 'Contract DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.contractRepository.deleteById(id);
  }
}
