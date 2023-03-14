import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'guards/local.guard';
import { SignupDto } from './dto/signup.dto';
import { ExcludePasswordInterceptor } from 'interceptors';
import { RequestWithUser } from 'users/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.authService.authorizeUser(userId);
  }

  @Post('signup')
  @UseInterceptors(ExcludePasswordInterceptor)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.registerUser(signupDto);
  }
}
