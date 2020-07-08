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
  Order,
} from '../models';
import {OrderHasProductRepository} from '../repositories';

export class OrderHasProductOrderController {
  constructor(
    @repository(OrderHasProductRepository)
    public orderHasProductRepository: OrderHasProductRepository,
  ) { }

  @get('/order-has-products/{id}/order', {
    responses: {
      '200': {
        description: 'Order belonging to OrderHasProduct',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Order)},
          },
        },
      },
    },
  })
  async getOrder(
    @param.path.string('id') id: typeof OrderHasProduct.prototype.id,
  ): Promise<Order> {
    return this.orderHasProductRepository.order(id);
  }
}
