import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'guards';
import { SignupDto } from './dto';
import { ExcludePasswordInterceptor } from 'interceptors';
import { User } from 'decorators';
import { User as UserEntity } from 'users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@User() user: UserEntity) {
    return this.authService.authorizeUser(user.id);
  }

  @Post('signup')
  @UseInterceptors(ExcludePasswordInterceptor)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }
}
