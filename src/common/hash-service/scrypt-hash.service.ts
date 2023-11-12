import { ScryptOptions, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { IHashService } from './hash.service.interface';

export class ScryptHashService implements IHashService {
  constructor(
    private readonly keyLength: number = 32,
    private readonly options: ScryptOptions = {}
  ) {}

  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      scrypt(password, salt, this.keyLength, this.options, (error, derivedKey) => {
        if (error) reject(error);
        resolve(derivedKey);
      });
    });

    return `${salt}.${buffer.toString('hex')}`;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, hashKey] = hash.split('.');
      const hashKeyBuffer = Buffer.from(hashKey, 'hex');
      scrypt(password, salt, this.keyLength, this.options, (error, derivedKey) => {
        if (error) reject(error);
        resolve(timingSafeEqual(hashKeyBuffer, derivedKey));
      });
    });
  }
}
