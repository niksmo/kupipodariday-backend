import { TypeOrmModule } from '@nestjs/typeorm';

const {
  POSTGRES_HOST = 'localhost',
  POSTGRES_PORT = 5432,
  POSTGRES_DB = 'db',
  POSTGRES_USER = 'user',
  POSTGRES_PASSWORD = 'user',
} = process.env;

TypeOrmModule.forRoot({
  type: 'postgres',
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [],
  synchronize: true,
});

export const OrmModule = TypeOrmModule;
