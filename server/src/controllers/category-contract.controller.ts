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
  Category,
  Contract,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryContractController {
  constructor(
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/contracts', {
    responses: {
      '200': {
        description: 'Array of Category has many Contract',
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
    return this.categoryRepository.contracts(id).find(filter);
  }

  @post('/categories/{id}/contracts', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contract)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {
            title: 'NewContractInCategory',
            exclude: ['id'],
            optional: ['categoryId']
          }),
        },
      },
    }) contract: Omit<Contract, 'id'>,
  ): Promise<Contract> {
    return this.categoryRepository.contracts(id).create(contract);
  }

  @patch('/categories/{id}/contracts', {
    responses: {
      '200': {
        description: 'Category.Contract PATCH success count',
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
    return this.categoryRepository.contracts(id).patch(contract, where);
  }

  @del('/categories/{id}/contracts', {
    responses: {
      '200': {
        description: 'Category.Contract DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Contract)) where?: Where<Contract>,
  ): Promise<Count> {
    return this.categoryRepository.contracts(id).delete(where);
  }
}
