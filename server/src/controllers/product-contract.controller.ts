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
  Product,
  Contract,
} from '../models';
import {ProductRepository} from '../repositories';

export class ProductContractController {
  constructor(
    @repository(ProductRepository) protected productRepository: ProductRepository,
  ) { }

  @get('/products/{id}/contracts', {
    responses: {
      '200': {
        description: 'Array of Product has many Contract',
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
    return this.productRepository.contracts(id).find(filter);
  }

  @post('/products/{id}/contracts', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Contract)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Product.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Contract, {
            title: 'NewContractInProduct',
            exclude: ['id'],
            optional: ['productId']
          }),
        },
      },
    }) contract: Omit<Contract, 'id'>,
  ): Promise<Contract> {
    return this.productRepository.contracts(id).create(contract);
  }

  @patch('/products/{id}/contracts', {
    responses: {
      '200': {
        description: 'Product.Contract PATCH success count',
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
    return this.productRepository.contracts(id).patch(contract, where);
  }

  @del('/products/{id}/contracts', {
    responses: {
      '200': {
        description: 'Product.Contract DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Contract)) where?: Where<Contract>,
  ): Promise<Count> {
    return this.productRepository.contracts(id).delete(where);
  }
}
