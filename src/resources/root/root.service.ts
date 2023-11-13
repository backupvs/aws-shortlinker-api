import HttpError from 'src/errors/HttpError';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';

export class RootService {
  constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

  async findByPathId(shortLinkPathId: string) {
    const shortLink = await this.shortLinksRepository.findByPathId(shortLinkPathId);

    if (!shortLink) {
      throw new HttpError(HttpCodes.NotFound, 'This URL points to nothing');
    }

    return shortLink;
  }

  async incrementVisitsCount(shortLinkId: string) {
    return this.shortLinksRepository.incrementVisitsCounterById(shortLinkId);
  }
}
