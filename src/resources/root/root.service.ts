import HttpError from 'src/errors/HttpError';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinkService } from '../short-link/short-link.service';

export class RootService {
  constructor(private readonly shortLinkService: ShortLinkService) {}

  async getDestination(shortLinkPathId: string) {
    const shortLink = await this.shortLinkService.getByPathId(shortLinkPathId);

    if (!shortLink) {
      throw new HttpError(HttpCodes.NotFound, 'This URL points to nothing');
    }

    return shortLink.destination;
  }
}
