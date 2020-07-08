import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  OrderHasProduct,
  Product,
} from '../models';
import {OrderHasProductRepository} from '../repositories';

export class OrderHasProductProductController {
  constructor(
    @repository(OrderHasProductRepository)
    public orderHasProductRepository: OrderHasProductRepository,
  ) { }

  @get('/order-has-products/{id}/product', {
    responses: {
      '200': {
        description: 'Product belonging to OrderHasProduct',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async getProduct(
    @param.path.string('id') id: typeof OrderHasProduct.prototype.id,
  ): Promise<Product> {
    return this.orderHasProductRepository.product(id);
  }
}
