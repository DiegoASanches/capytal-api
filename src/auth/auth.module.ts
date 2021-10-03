import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from './../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/secret';
import { EnvironmentModule } from './../environment/environment.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { CryptService } from './crypt/crypt.service';

@Module({
  imports: [
    EnvironmentModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, CryptService],
  controllers: [AuthController],
})
export class AuthModule {}
