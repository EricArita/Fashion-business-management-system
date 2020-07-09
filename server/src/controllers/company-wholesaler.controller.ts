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
  Company,
  Wholesaler,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyWholesalerController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/wholesalers', {
    responses: {
      '200': {
        description: 'Array of Wholesalers that belong to a specific Company',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Wholesaler)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Wholesaler>,
  ): Promise<Wholesaler[]> {
    return this.companyRepository.wholesalers(id).find(filter);
  }

  @post('/companies/{id}/wholesalers', {
    responses: {
      '200': {
        description: 'Wholesaler model instance',
        content: {'application/json': {schema: getModelSchemaRef(Wholesaler)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wholesaler, {
            title: 'NewWholesalerInCompany',
            exclude: ['id'],
            optional: ['companyId']
          }),
        },
      },
    }) wholesaler: Omit<Wholesaler, 'id'>,
  ): Promise<Wholesaler> {
    return this.companyRepository.wholesalers(id).create(wholesaler);
  }

  @patch('/companies/{id}/wholesalers', {
    responses: {
      '200': {
        description: 'Company.Wholesaler PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Wholesaler, {partial: true}),
        },
      },
    })
    wholesaler: Partial<Wholesaler>,
    @param.query.object('where', getWhereSchemaFor(Wholesaler)) where?: Where<Wholesaler>,
  ): Promise<Count> {
    return this.companyRepository.wholesalers(id).patch(wholesaler, where);
  }

  @del('/companies/{id}/wholesalers', {
    responses: {
      '200': {
        description: 'Company.Wholesaler DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Wholesaler)) where?: Where<Wholesaler>,
  ): Promise<Count> {
    return this.companyRepository.wholesalers(id).delete(where);
  }
}
