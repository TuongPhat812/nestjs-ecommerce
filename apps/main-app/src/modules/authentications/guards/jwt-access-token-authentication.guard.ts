import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtAccessTokenAuthenticationGuard extends AuthGuard('jwt') {}

export { JwtAccessTokenAuthenticationGuard };
