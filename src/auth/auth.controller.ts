import { Body, Controller, Post, Logger, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Public } from './decorators/public.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GetUser } from './decorators/get-user.decorator';


@Controller('auth')
export class AuthController {

  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }

  @Public()
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

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`POST /login - Login request for identifier: ${loginDto.identifier}`);
    return this.authService.login(loginDto);
  }


  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const { identifier } = forgetPasswordDto;
    this.logger.log(`POST /forget-password - Forget password request for identifier: ${identifier}`);
    await this.authService.forgetPassword(identifier);
    return 'Reset password link has been sent to your email';
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    this.logger.log('POST /reset-password - Reset password request received');
    await this.authService.resetPassword(resetPasswordDto);
    return 'Password has been successfully reset';
  }

  @Public()
  @Post('refresh-token')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@GetUser() user: any) {
    const { refreshToken } = user;
    this.logger.debug(`POST /refresh-token - Refresh token request for user ID: ${JSON.stringify(user)}`);
    return this.authService.generateTokens(user.userId)
  }

  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto) {
    const { refreshToken } = logoutDto;
    return 'Successfully logged out';
  }
}
