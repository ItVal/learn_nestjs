import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signupDto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return 'signup';
  }
}
