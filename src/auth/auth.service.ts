import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { CryptService } from './crypt/crypt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cryptService: CryptService,
  ) {}

  public async validateUser(email: string, password: string) {
    return await this.usersService
      .findOne({ email })
      .then(async (user) => {
        if (!user) {
          return Promise.reject(new UnauthorizedException('Invalid password'));
        }
        return (await this.cryptService.checkPassword(user.password, password))
          ? Promise.resolve(user)
          : Promise.reject(new UnauthorizedException('Invalid password'));
      })
      .catch((err) => Promise.reject(err));
  }

  public async enableAccount(userID: string) {
    return await this.usersService.findOneAndUpdate(
      { userID },
      { enable: true },
    );
  }

  public async disableAccount(userID: string) {
    return await this.usersService.findOneAndUpdate(
      { userID },
      { enable: false },
    );
  }

  public async verify(payload) {
    return await this.usersService
      .findOne({ _id: payload._id })
      .then((signedUser) => Promise.resolve(signedUser))
      .catch((err) =>
        Promise.reject(new UnauthorizedException('Invalid Authorization')),
      );
  }

  public async generateJWT(signedUser) {
    const expiresIn = moment().add(5, 'minutes').format('x');
    const user = {
      id: signedUser._id,
      username: signedUser.username,
    };
    return {
      expires_in: expiresIn,
      access_token: this.jwtService.sign(user),
      ...user,
    };
  }

  public async parseJWT(jwtToken: string) {
    return await this.jwtService.decode(jwtToken);
  }
}
