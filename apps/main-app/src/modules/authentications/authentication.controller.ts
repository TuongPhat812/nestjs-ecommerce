import { Body, Req, Controller, HttpCode, Post, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDTO } from './dtos';
import { RequestWithUser } from './types';
import { LocalAuthenticationGuard, JwtAccessTokenAuthenticationGuard, JwtRefreshTokenGuard } from './guards';
import { UserService } from '../users/user.service';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDTO) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return request.user;
  }

  @HttpCode(204)
  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser) {
    await this.userService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return;
  }

  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
