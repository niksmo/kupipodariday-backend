import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { IUser } from 'users/entities/types';

@Injectable()
export class SensitiveOwnerDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map<{ owner?: IUser }, unknown>((data) => {
        if (data.owner) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, createdAt, updatedAt, ...interceptedOwner } =
            data.owner;
          return { ...data, owner: interceptedOwner };
        }
        return data;
      })
    );
  }
}
