import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'guards/local.guard';
import { SignupDto } from './dto/signup.dto';
import { ExcludeUserPasswordInterceptor } from 'interceptors';
import { User } from 'decorators/user.decorator';
import { IUser } from 'users/entities/types';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@User() user: IUser) {
    return this.authService.authorizeUser(user.id);
  }

  @Post('signup')
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }
}
