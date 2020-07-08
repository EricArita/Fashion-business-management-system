import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'dbTKPM',
  connector: 'mongodb',
  url: `mongodb+srv://Vodka:mypassword6199@cluster0-5k212.azure.mongodb.net/TKPM?retryWrites=true&w=majority`,
  host: 'cluster0-shard-00-02-5k212.azure.mongodb.net:27017',
  port: 27017,
  user: 'Vodka',
  password: 'mypassword6199',
  database: 'TKPM',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbTkpmDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'dbTKPM';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.dbTKPM', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
