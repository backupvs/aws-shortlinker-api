export interface IJwtService {
  createToken(payload: any, publicKeyOrSecret?: string | Buffer): Promise<string>;
  verify<Payload>(
    token: string,
    privateKeyOrSecret?: string | Buffer
  ): Promise<Payload | null>;
}
