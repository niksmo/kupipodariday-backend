import { Request } from 'express';
import { User } from './entities/user.entity';

export type TUserId = string;

export interface RequestWithUser extends Request {
  user: User;
}
