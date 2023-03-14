export function appConfig() {
  return {
    port: Number(process.env.PORT),
    database: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'user',
      database: process.env.POSTGRES_DB || 'db',
    },
    jwtSecret: process.env.JWT_SECRET || 'secret',
    hashRounds: Number(process.env.HASH_SALT) || 10,
  };
}

export type TAppConfig = ReturnType<typeof appConfig>;
