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
  Supplier,
  Product,
} from '../models';
import {SupplierRepository} from '../repositories';

export class SupplierProductController {
  constructor(
    @repository(SupplierRepository) protected supplierRepository: SupplierRepository,
  ) { }

  @get('/suppliers/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Products that belong to a specific Supplier',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.supplierRepository.products(id).find(filter);
  }

  @post('/suppliers/{id}/products', {
    responses: {
      '200': {
        description: 'Supplier model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Supplier.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInSupplier',
            exclude: ['id'],
            optional: ['supplierId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.supplierRepository.products(id).create(product);
  }

  @patch('/suppliers/{id}/products', {
    responses: {
      '200': {
        description: 'Supplier.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.supplierRepository.products(id).patch(product, where);
  }

  @del('/suppliers/{id}/products', {
    responses: {
      '200': {
        description: 'Supplier.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.supplierRepository.products(id).delete(where);
  }
}
