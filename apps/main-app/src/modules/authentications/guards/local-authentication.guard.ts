import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class LocalAuthenticationGuard extends AuthGuard('local') {}

export { LocalAuthenticationGuard };
