import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from './model/users.model';
import { CryptService } from './../auth/crypt/crypt.service';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly User: Model<UserModel>,
    private cryptService: CryptService,
  ) {}

  public async findOne(params?, id?: string): Promise<any> {
    return await this.User.findOne(params ? params : id);
  }

  public async deleteByID(id: string): Promise<any> {
    return await this.User.findByIdAndRemove(id)
      .then((user) => {
        return user ? Promise.resolve(user) : Promise.reject('user not exist');
      })
      .catch((err) => Promise.reject(new NotFoundException(err)));
  }

  public async findByID(id: string): Promise<any> {
    return await this.User.findById(id)
      .then((user) => {
        return user ? Promise.resolve(user) : Promise.reject('User not exist');
      })
      .catch((err) => Promise.reject(new NotFoundException(err)));
  }

  public async findOneAndUpdate(query: any = {}, data: any = {}): Promise<any> {
    return await this.User.findOneAndUpdate(query, data)
      .then((user) => {
        return user ? Promise.resolve(user) : Promise.reject('user not exist');
      })
      .catch((err) => Promise.reject(new NotFoundException(err)));
  }

  public async get(params): Promise<any> {
    return await this.User.find(params)
      .then((user) => {
        return user ? Promise.resolve(user) : Promise.reject('User not exist');
      })
      .catch((err) => Promise.reject(new NotFoundException(err)));
  }

  public async create(params: UserModel): Promise<any> {
    params.password = this.cryptService.hashPassword(params.password);
    params.transactionId = this.cryptService.generateRandomHash();
    return await this.User.create(params)
      .then(
        (user) => {
          return user
            ? Promise.resolve(user)
            : Promise.reject('User not exist');
        },
        (err) => {
          return Promise.reject(new BadRequestException(err));
        },
      )
      .catch((err) => Promise.reject(new NotFoundException(err)));
  }
}
