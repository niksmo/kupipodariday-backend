import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { User } from 'users/entities/user.entity';

@Injectable()
export class SensitiveOwnerDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map<{ owner: User } | { owner: User }[], unknown>((data) => {
        function excludeSensitiveData(
          owner: User
        ): Omit<User, 'password' | 'email'> {
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
