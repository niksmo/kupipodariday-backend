import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { User } from 'users/entities/user.entity';

@Injectable()
export class SensitiveUserDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map<{ user: User } | { user: User }[], unknown>((data) => {
        function excludeSensitiveData(
          user: User
        ): Omit<User, 'password' | 'email'> {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...interceptedOwner } = user;
          return interceptedOwner;
        }

        if (Array.isArray(data)) {
          return data.map((arrayItem) => {
            return {
              ...arrayItem,
              user: excludeSensitiveData(arrayItem.user),
            };
          });
        }

        return { ...data, user: excludeSensitiveData(data.user) };
      })
    );
  }
}
