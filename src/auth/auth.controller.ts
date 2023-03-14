import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { LocalAuthGuard } from './local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  login(@Body() signinDto: SigninDto, @Req() req: Request) {
    console.log('dto', signinDto);
    return { success: req.user };
  }
}
