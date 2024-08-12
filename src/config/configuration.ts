import 'dotenv/config';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
});