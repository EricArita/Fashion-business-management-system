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
  Product,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryProductController {
  constructor(
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Category has many Product',
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
    return this.categoryRepository.products(id).find(filter);
  }

  @post('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInCategory',
            exclude: ['id'],
            optional: ['categoryId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.categoryRepository.products(id).create(product);
  }

  @patch('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Category.Product PATCH success count',
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
    return this.categoryRepository.products(id).patch(product, where);
  }

  @del('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Category.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.categoryRepository.products(id).delete(where);
  }
}
