import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrmModule } from './db/orm.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' }), OrmModule],
  providers: [],
})
export class AppModule {}
