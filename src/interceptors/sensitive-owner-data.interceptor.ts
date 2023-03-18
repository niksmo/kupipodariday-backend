import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { TUser } from 'users/entities/types';

@Injectable()
export class SensitiveOwnerDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, createdAt, updatedAt, ...interceptedOwner } =
          data.owner as Partial<TUser>;
        return { ...data, owner: interceptedOwner };
      })
    );
  }
}
