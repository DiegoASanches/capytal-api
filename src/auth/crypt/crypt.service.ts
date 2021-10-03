import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptService {

  private getHash(password, salt) {
    return pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
  }

  public hashPassword(password) {
    const salt = randomBytes(32).toString('hex');
    const hash = this.getHash(password, salt);
    return [salt, hash].join('$');
  }

  public checkPassword(saltedPasswordHash, candidatePassword) {
    const originalHash = saltedPasswordHash.split('$')[1];
    const salt = saltedPasswordHash.split('$')[0];
    const hash = this.getHash(candidatePassword, salt);
    return (hash === originalHash) ? true : false;
  }

  public decodeJWT(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const buff = new Buffer(base64, 'base64');
    const payloadinit = buff.toString('ascii');
    const payload = JSON.parse(payloadinit);
    return payload;
  }

  public generateRandomHash() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < charactersLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
