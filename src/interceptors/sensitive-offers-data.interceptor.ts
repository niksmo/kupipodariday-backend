import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Offer } from 'offers/entities/offer.entity';
import { map } from 'rxjs';

@Injectable()
export class SensitiveOffersDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map<{ offers: Offer[] }, unknown>((data) => {
        if (Array.isArray(data.offers) && data.offers.length > 0) {
          let visibleOffers = data.offers.filter(
            (offer) => offer.hidden === false
          );

          if (visibleOffers[0]?.user.password) {
            visibleOffers = visibleOffers.map((offer) => {
              delete offer.user.password;
              return offer;
            });
          }
          return { ...data, offers: visibleOffers };
        }

        return data;
      })
    );
  }
}
