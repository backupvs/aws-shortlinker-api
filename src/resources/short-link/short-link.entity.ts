export class ShortLink {
  public readonly visitsCount: number = 0;

  constructor(
    public readonly shortLinkId: string,
    public readonly pathId: string,
    public readonly destination: string,
    public readonly expirationTime: number,
    public readonly isOneTime: boolean,
    public readonly ownerId: string
  ) {}
}
