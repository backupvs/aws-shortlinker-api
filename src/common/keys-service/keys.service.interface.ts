export interface IKeysService {
  getPublicKey(): Promise<string>;
  getPrivateKey(): Promise<string>;
}
