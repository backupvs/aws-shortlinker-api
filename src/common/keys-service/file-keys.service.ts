import { IKeysService } from './keys.service.interface';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export class FileKeysService implements IKeysService {
  constructor(private readonly keysDir: string) {}

  getPublicKey(): Promise<string> {
    return readFile(join(process.cwd(), this.keysDir, 'public.pem'), 'utf-8');
  }

  getPrivateKey(): Promise<string> {
    return readFile(join(process.cwd(), this.keysDir, 'private.pem'), 'utf-8');
  }
}
