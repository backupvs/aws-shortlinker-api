export type Keys = {
  privateKey: string;
  publicKey: string;
};

export interface IKeysService {
  importKeys(): Promise<Keys>;
}
