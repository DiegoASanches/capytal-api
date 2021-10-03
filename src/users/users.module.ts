import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { CryptService } from './../auth/crypt/crypt.service';
import { Environment } from '../environment/model/env.model';
import { EnvironmentService } from './../environment/environment.service';
import { EnvironmentModule } from './../environment/environment.module';

const env: Environment = new EnvironmentService().env();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Users', schema: userSchema }]),
    EnvironmentModule,
  ],
  providers: [UsersService, CryptService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
