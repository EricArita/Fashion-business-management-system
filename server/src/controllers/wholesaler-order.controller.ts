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
  Order,
} from '../models';
import {WholesalerRepository} from '../repositories';

export class WholesalerOrderController {
  constructor(
    @repository(WholesalerRepository) protected wholesalerRepository: WholesalerRepository,
  ) { }

  @get('/wholesalers/{id}/orders', {
    responses: {
      '200': {
        description: 'Array of Wholesaler has many Order',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Order)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Order>,
  ): Promise<Order[]> {
    return this.wholesalerRepository.orders(id).find(filter);
  }

  @post('/wholesalers/{id}/orders', {
    responses: {
      '200': {
        description: 'Wholesaler model instance',
        content: {'application/json': {schema: getModelSchemaRef(Order)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Wholesaler.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewOrderInWholesaler',
            exclude: ['id'],
            optional: ['wholesalerId']
          }),
        },
      },
    }) order: Omit<Order, 'id'>,
  ): Promise<Order> {
    return this.wholesalerRepository.orders(id).create(order);
  }

  @patch('/wholesalers/{id}/orders', {
    responses: {
      '200': {
        description: 'Wholesaler.Order PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Partial<Order>,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.wholesalerRepository.orders(id).patch(order, where);
  }

  @del('/wholesalers/{id}/orders', {
    responses: {
      '200': {
        description: 'Wholesaler.Order DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Order)) where?: Where<Order>,
  ): Promise<Count> {
    return this.wholesalerRepository.orders(id).delete(where);
  }
}
