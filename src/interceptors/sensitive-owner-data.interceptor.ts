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
      map<{ owner: IUser } | { owner: IUser }[], unknown>((data) => {
        function excludeSensitiveData(
          owner: IUser
        ): Omit<IUser, 'password' | 'email'> {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, email, ...interceptedOwner } = owner;
          return interceptedOwner;
        }

        if (Array.isArray(data)) {
          return data.map((arrayItem) => {
            return {
              ...arrayItem,
              owner: excludeSensitiveData(arrayItem.owner),
            };
          });
        }

        return { ...data, owner: excludeSensitiveData(data.owner) };
      })
    );
  }
}
