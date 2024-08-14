import { DataSource, DataSourceOptions } from "typeorm";


export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'duan0406',
  database: 'wowi_test',
  //schema: ['dist/**/*.entity{.ts,.js}'],
  entities: [
    'dist/src/**/*.entity{.ts,.js}',
  ],
  migrations: [
    'dist/db/migrations/*{.ts,.js}'
  ],
  synchronize: true, // if true, you don't really need migrations
}

const dataSourceLocal = new DataSource(dataSourceOptions);

export default dataSourceLocal;