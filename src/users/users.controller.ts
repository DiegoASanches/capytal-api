import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Param,
  UseGuards,
  Delete,
  BadRequestException,
  ConflictException,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from './../auth/jwt/jwt-auth.guard';
import { CryptService } from './../auth/crypt/crypt.service';
import { UsersService } from './users.service';
import { throwError } from 'rxjs';
import { UserModel } from './model/users.model';
import { EnvironmentService } from './../environment/environment.service';
import { Environment } from './../environment/model/env.model';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private cryptService: CryptService,
    private environmentService: EnvironmentService,
  ) {}

  @Post()
  public async create(@Body() body) {
    if (body && !body.email) {
      return throwError(new BadRequestException('Missing email param'));
    }
    if (body && !body.username) {
      return throwError(new BadRequestException('Missing username param'));
    }
    if (body && !body.password) {
      body.password = this.cryptService.generateRandomHash();
    }

    const userFind = await this.userService.findOne({ email: body.email });
    if (userFind) {
      return throwError(new ConflictException('User already has account'));
    }
    return await this.userService.create(body);
  }

  @Post('forget-password')
  public async forgetPassword(@Body() body) {
    if (body && !body.email) {
      return throwError(new BadRequestException('Missing email param'));
    }
    const newTransactionID = this.cryptService.generateRandomHash();
    const userFind = await this.userService.findOne({ email: body.email });
    const environment: Environment = this.environmentService.env();
    if (!userFind) {
      return throwError(new BadRequestException('User not found'));
    }

    await this.userService.findOneAndUpdate(
      { email: body.email },
      { transactionId: newTransactionID },
    );
    return {
      status: 'succeess',
      message: `Email sent to ${body.email}`,
    };
  }

  @Put('change-password')
  public async changePassword(@Body() body) {
    if (body && !body.transactionId) {
      return throwError(new BadRequestException('Missing transactionId param'));
    }
    if (body && !body.password) {
      return throwError(new BadRequestException('Missing password param'));
    }

    const newTransactionID: string = this.cryptService.generateRandomHash();
    const userFind: UserModel = await this.userService.findOne({
      transactionId: body.transactionId,
    });
    if (!userFind) {
      return throwError(new BadRequestException('Invalid transaction id'));
    }
    const cryptPassword: string = this.cryptService.hashPassword(body.password);
    await this.userService.findOneAndUpdate(
      { transactionId: body.transactionId },
      {
        transactionId: newTransactionID,
        password: cryptPassword,
        hasPassword: true,
      },
    );
    return {
      status: 'succeess',
      email: userFind.email,
      message: 'password changed',
    };
  }

  @Get('hasPassword/:email')
  public async hasPassword(@Param() params) {
    if (params && !params.email) {
      return throwError(new BadRequestException('Missing email'));
    }

    const email = params.email;
    const userFind: UserModel = await this.userService.findOne({ email });
    if (!userFind) {
      return throwError(new NotFoundException('User not found'));
    }
    const hasPassword: boolean =
      userFind && userFind.hasPassword ? userFind.hasPassword : false;
    const result: any = { hasPassword };
    if (hasPassword === false) {
      result.transactionId = userFind.transactionId;
    }
    return result;
  }

  @Get('isValidTransaction/:transactionID')
  public async isValidTransaction(@Param() params) {
    if (params && !params.transactionID) {
      return throwError(new BadRequestException('Missing transactionID'));
    }

    const transactionID: string = params.transactionID;
    const userFind: UserModel = await this.userService.findOne({
      transactionId: transactionID,
    });
    if (!userFind) {
      return throwError(new NotFoundException('Invalid transaction id'));
    }
    return {
      status: 'succeess',
      message: 'valid transaction',
    };
  }

  @Get('isAccountEnable/:id')
  public async isAcccountEnable(@Param() param) {
    const params = param;
    const user: UserModel = await this.userService.findByID(params.id);
    return {
      enable: user.enable,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  public async getAll(@Body() body, @Query() query) {
    const params = query;
    return await this.userService.get(params);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  public async findOne(@Param() param) {
    const params = param;
    return await this.userService.findByID(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  public async delete(@Param() params) {
    return await this.userService.deleteByID(params.id);
  }
}
