import {
  Controller,
  Post,
  Req,
  Body,
  UnauthorizedException,
  Put,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CryptService } from './crypt/crypt.service';
import { throwError } from 'rxjs';
import { UserModel } from './../users/model/users.model';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private cryptService: CryptService,
  ) {}

  /**
   *
   * @param body
   * email: string
   * password: string
   */
  @Post('login')
  public async loginJwt(@Body() body) {
    const payload = body;
    const user: UserModel = await this.authService.validateUser(
      payload.email,
      payload.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const isAccountsEnable: boolean = user.enable;
    if (isAccountsEnable === false) {
      await this.authService.enableAccount(user._id);
    }
    return await this.authService.generateJWT(user);
  }

  /**
   *
   * @param body
   * username, email, password
   */
  @Post('registerAndLogin')
  public async registerAndLogin(@Body() body) {
    if (body && !body.email) {
      return new BadRequestException('Missing email param');
    }
    if (body && !body.username) {
      return new BadRequestException('Missing username param');
    }
    if (body && !body.password) {
      body.password = this.cryptService.generateRandomHash();
    }

    const userFind = await this.userService.findOne({ email: body.email });
    if (userFind) {
      return throwError(new ConflictException('User already has account'));
    }

    const user = await this.userService.create(body);

    return await this.authService.generateJWT(user);
  }

  /**
   *
   * @param req
   * @param body
   * authorization: -> Bearer Token
   */
  @Put('refresh-token')
  public async refreshToken(@Body() body) {
    const jwtToken = body.authorization;
    if (!jwtToken) {
      return new BadRequestException('Empty Token');
    }
    const decodeToken: any = await this.authService.parseJWT(jwtToken);
    const user = await this.authService.verify({ _id: decodeToken.id });
    if (Object.keys(user).length === 0 || !user._id) {
      return throwError(new UnauthorizedException('Invalid token'));
    }
    return await this.authService.generateJWT(user);
  }
}
