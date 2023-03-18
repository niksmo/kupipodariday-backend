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
import { ExcludePasswordInterceptor } from 'interceptors';
import { User } from 'decorators/user.decorator';
import { TUser } from 'users/entities/types';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@User() user: TUser) {
    return this.authService.authorizeUser(user.id);
  }

  @Post('signup')
  @UseInterceptors(ExcludePasswordInterceptor)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }
}
