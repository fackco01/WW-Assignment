import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "duan0406",
    database: "micro_post",
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/db/migration/*{.ts,.js}"],
    synchronize: true,
}

const dataSourceLocal = new DataSource(dataSourceOptions);

export default dataSourceLocal