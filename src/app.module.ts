import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'auth/auth.module';
import { appConfig } from 'config';
import { OffersModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishListsModule } from './wishlists/wishlists.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', load: [appConfig] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...appConfig().database,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    WishesModule,
    WishListsModule,
    OffersModule,
  ],
})
export class AppModule {}
