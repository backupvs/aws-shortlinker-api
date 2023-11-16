import { IKeysService, Keys } from './keys.service.interface';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export class FileKeysService implements IKeysService {
  constructor(private readonly keysDirPath: string) {}

  async importKeys(): Promise<Keys> {
    const privateKeyPath = join(this.keysDirPath, 'private.pem');
    const publicKeyPath = join(this.keysDirPath, 'public.pem');

    const [privateKey, publicKey] = await Promise.all(
      [privateKeyPath, publicKeyPath].map((path) => readFile(path, 'utf-8'))
    );

    return {
      privateKey,
      publicKey,
    };
  }
}
