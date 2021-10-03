import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(req, payload, test) {
    return payload;
  }
}

export const callback = (err, user, info) => {
  let message;
  if (err) {
    return (err || new UnauthorizedException(info.message));
  } else if (typeof info !== 'undefined' || !user) {
    switch (info.message) {
      case 'No auth token':
      case 'invalid signature':
      case 'jwt malformed':
      case 'invalid token':
      case 'invalid signature':
        message = 'You must provide a valid authenticated access token';
        break;
      case 'jwt expired':
        message = 'Your session has expired';
        break;
      default:
        message = info.message;
        break;
    }
    throw new UnauthorizedException(message);
  }
  return user;
};
