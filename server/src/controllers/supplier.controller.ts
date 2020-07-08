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
import {Supplier} from '../models';
import {SupplierRepository} from '../repositories';

export class SupplierController {
  constructor(
    @repository(SupplierRepository)
    public supplierRepository : SupplierRepository,
  ) {}

  @post('/suppliers', {
    responses: {
      '200': {
        description: 'Supplier model instance',
        content: {'application/json': {schema: getModelSchemaRef(Supplier)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Supplier, {
            title: 'NewSupplier',
            exclude: ['id'],
          }),
        },
      },
    })
    supplier: Omit<Supplier, 'id'>,
  ): Promise<Supplier> {
    return this.supplierRepository.create(supplier);
  }

  @get('/suppliers/count', {
    responses: {
      '200': {
        description: 'Supplier model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Supplier) where?: Where<Supplier>,
  ): Promise<Count> {
    return this.supplierRepository.count(where);
  }

  @get('/suppliers', {
    responses: {
      '200': {
        description: 'Array of Supplier model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Supplier, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Supplier) filter?: Filter<Supplier>,
  ): Promise<Supplier[]> {
    return this.supplierRepository.find(filter);
  }

  @patch('/suppliers', {
    responses: {
      '200': {
        description: 'Supplier PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Supplier, {partial: true}),
        },
      },
    })
    supplier: Supplier,
    @param.where(Supplier) where?: Where<Supplier>,
  ): Promise<Count> {
    return this.supplierRepository.updateAll(supplier, where);
  }

  @get('/suppliers/{id}', {
    responses: {
      '200': {
        description: 'Supplier model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Supplier, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Supplier, {exclude: 'where'}) filter?: FilterExcludingWhere<Supplier>
  ): Promise<Supplier> {
    return this.supplierRepository.findById(id, filter);
  }

  @patch('/suppliers/{id}', {
    responses: {
      '204': {
        description: 'Supplier PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Supplier, {partial: true}),
        },
      },
    })
    supplier: Supplier,
  ): Promise<void> {
    await this.supplierRepository.updateById(id, supplier);
  }

  @put('/suppliers/{id}', {
    responses: {
      '204': {
        description: 'Supplier PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() supplier: Supplier,
  ): Promise<void> {
    await this.supplierRepository.replaceById(id, supplier);
  }

  @del('/suppliers/{id}', {
    responses: {
      '204': {
        description: 'Supplier DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.supplierRepository.deleteById(id);
  }
}
