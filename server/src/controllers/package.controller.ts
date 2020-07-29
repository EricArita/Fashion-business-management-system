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
import {Package} from '../models';
import {PackageRepository} from '../repositories';

export class PackageController {
  constructor(
    @repository(PackageRepository)
    public packagesRepository : PackageRepository,
  ) {}

  @post('/packages', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: getModelSchemaRef(Package)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Package, {
            title: 'NewPackage',
            exclude: ['id'],
          }),
        },
      },
    })
    packages: Omit<Package, 'id'>,
  ): Promise<Package> {
    return this.packagesRepository.create(packages);
  }

  @get('/packages/count', {
    responses: {
      '200': {
        description: 'Package model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Package) where?: Where<Package>,
  ): Promise<Count> {
    return this.packagesRepository.count(where);
  }

  @get('/packages', {
    responses: {
      '200': {
        description: 'Array of Package model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Package, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Package) filter?: Filter<Package>,
  ): Promise<Package[]> {
    return this.packagesRepository.find(filter);
  }

  @patch('/packages', {
    responses: {
      '200': {
        description: 'Package PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Package, {partial: true}),
        },
      },
    })
    packages: Package,
    @param.where(Package) where?: Where<Package>,
  ): Promise<Count> {
    return this.packagesRepository.updateAll(packages, where);
  }

  @get('/packages/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Package, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Package, {exclude: 'where'}) filter?: FilterExcludingWhere<Package>
  ): Promise<Package> {
    return this.packagesRepository.findById(id, filter);
  }

  @patch('/packages/{id}', {
    responses: {
      '204': {
        description: 'Package PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Package, {partial: true}),
        },
      },
    })
    packages: Package,
  ): Promise<void> {
    await this.packagesRepository.updateById(id, packages);
  }

  @put('/packages/{id}', {
    responses: {
      '204': {
        description: 'Package PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() packages: Package,
  ): Promise<void> {
    await this.packagesRepository.replaceById(id, packages);
  }

  @del('/packages/{id}', {
    responses: {
      '204': {
        description: 'Package DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.packagesRepository.deleteById(id);
  }
}
