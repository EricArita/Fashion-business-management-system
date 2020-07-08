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
import {Wholesaler} from '../models';
import {WholesalerRepository} from '../repositories';

export class WholesalerController {
  constructor(
    @repository(WholesalerRepository)
    public wholesalerRepository : WholesalerRepository,
  ) {}

  @post('/wholesalers', {
    responses: {
      '200': {
        description: 'Wholesaler model instance',
        content: {'application/json': {schema: getModelSchemaRef(Wholesaler)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wholesaler, {
            title: 'NewWholesaler',
            exclude: ['id'],
          }),
        },
      },
    })
    wholesaler: Omit<Wholesaler, 'id'>,
  ): Promise<Wholesaler> {
    return this.wholesalerRepository.create(wholesaler);
  }

  @get('/wholesalers/count', {
    responses: {
      '200': {
        description: 'Wholesaler model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Wholesaler) where?: Where<Wholesaler>,
  ): Promise<Count> {
    return this.wholesalerRepository.count(where);
  }

  @get('/wholesalers', {
    responses: {
      '200': {
        description: 'Array of Wholesaler model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Wholesaler, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Wholesaler) filter?: Filter<Wholesaler>,
  ): Promise<Wholesaler[]> {
    return this.wholesalerRepository.find(filter);
  }

  @patch('/wholesalers', {
    responses: {
      '200': {
        description: 'Wholesaler PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wholesaler, {partial: true}),
        },
      },
    })
    wholesaler: Wholesaler,
    @param.where(Wholesaler) where?: Where<Wholesaler>,
  ): Promise<Count> {
    return this.wholesalerRepository.updateAll(wholesaler, where);
  }

  @get('/wholesalers/{id}', {
    responses: {
      '200': {
        description: 'Wholesaler model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Wholesaler, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Wholesaler, {exclude: 'where'}) filter?: FilterExcludingWhere<Wholesaler>
  ): Promise<Wholesaler> {
    return this.wholesalerRepository.findById(id, filter);
  }

  @patch('/wholesalers/{id}', {
    responses: {
      '204': {
        description: 'Wholesaler PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wholesaler, {partial: true}),
        },
      },
    })
    wholesaler: Wholesaler,
  ): Promise<void> {
    await this.wholesalerRepository.updateById(id, wholesaler);
  }

  @put('/wholesalers/{id}', {
    responses: {
      '204': {
        description: 'Wholesaler PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() wholesaler: Wholesaler,
  ): Promise<void> {
    await this.wholesalerRepository.replaceById(id, wholesaler);
  }

  @del('/wholesalers/{id}', {
    responses: {
      '204': {
        description: 'Wholesaler DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.wholesalerRepository.deleteById(id);
  }
}
