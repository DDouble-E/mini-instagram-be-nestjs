import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';


@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    this.logger.log(`POST /sign-up - Sign up request for email: ${signUpDto.email}`);
    const createUserDto: CreateUserDto = {
      fullName: signUpDto.fullName,
      username: signUpDto.username,
      email: signUpDto.email,
      password: signUpDto.password,
    }
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return {
      userId: '9d32-fake-id-1234-5678-abcdef',
      username: 'testuser',
      accessToken: 'fake-jwt-token-1234567890',
      refreshToken: 'fake-refresh-token-0987654321',
    };
  }


  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const { identifier } = forgetPasswordDto;
    return 'Reset password link has been sent to your email';
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return 'Password has been successfully reset';
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    return {
      accessToken: 'new-fake-jwt-token-1234567890',
    };
  }

  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto) {
    const { refreshToken } = logoutDto;
    return 'Successfully logged out';
  }
}
