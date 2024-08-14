import { DataSource, DataSourceOptions } from "typeorm";
import * as process from "node:process";


export const dataSourceOptions_prod: DataSourceOptions = {
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === 'true', // if true, you don't really need migrations
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/db/migrations/*{.ts,.js}"],
}

export const dataSourceProd = new DataSource(dataSourceOptions_prod);
export default dataSourceProd;