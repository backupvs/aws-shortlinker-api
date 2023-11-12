import { IJwtService } from './jwt.service.interface';
import { createPrivateKey, createPublicKey } from 'crypto';
import { CompactEncrypt, compactDecrypt } from 'jose';

export class JweTokenService implements IJwtService {
  async createToken(
    payload: Record<string, unknown>,
    publicKey: string | Buffer
  ): Promise<string> {
    const claims = {
      sub: payload,
      exp: Date.now() + +process.env.JWE_EXPIRES_IN,
    };

    const claimsBuffer = Buffer.from(JSON.stringify(claims));
    const key = createPublicKey(publicKey);

    const jweToken = await new CompactEncrypt(claimsBuffer)
      .setProtectedHeader({ alg: 'RSA-OAEP', enc: 'A256GCM' })
      .encrypt(key);

    return jweToken;
  }

  async verify<Payload>(
    token: string,
    privateKey: string | Buffer
  ): Promise<Payload | null> {
    try {
      const key = createPrivateKey(privateKey);
      const decrypted = await compactDecrypt(token, key);
      const claims = JSON.parse(Buffer.from(decrypted.plaintext).toString('utf-8'));
      if (Date.now() > claims.exp) return null;

      return claims.sub;
    } catch (err) {
      return null;
    }
  }
}
