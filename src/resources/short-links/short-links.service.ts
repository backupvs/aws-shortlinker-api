import { randomUUID } from 'node:crypto';
import { CreateShortLinkDto } from './dto.types';
import { ShortLinksRepository } from '@database/repositories/short-links.repository';
import { ShortLink } from './short-link.entity';
import HttpError from 'src/errors/HttpError';
import { HttpCodes } from '@utils/http-codes.enum';
import { nanoid } from 'nanoid';

export class ShortLinksService {
  constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

  async create(createShortLinkDto: CreateShortLinkDto, ownerId: string) {
    const isOneTime = !createShortLinkDto.lifetime;
    let expirationTime = null;
    let exisitingShortLink: ShortLink;
    let pathId: string;

    // Generating a new short pathId if a collision occurs,
    // until it becomes unique.
    do {
      pathId = nanoid(+process.env.SHORT_LINK_LENGTH);
      exisitingShortLink = await this.shortLinksRepository.findByPathId(pathId);
    } while (exisitingShortLink);

    if (!isOneTime) {
      const daysCount = createShortLinkDto.lifetime.split(' ')[0];
      const lifetimeInMillis = Number.parseInt(daysCount) * 24 * 60 * 60 * 1000;
      expirationTime = Date.now() + lifetimeInMillis;
    }

    const shortLink = new ShortLink(
      randomUUID({ disableEntropyCache: true }),
      pathId,
      createShortLinkDto.url,
      expirationTime,
      isOneTime,
      ownerId
    );
    await this.shortLinksRepository.create(shortLink);

    return shortLink.pathId;
  }

  async findByOwnerId(ownerId: string) {
    return this.shortLinksRepository.findByOwnerId(ownerId);
  }

  async findExpiredActive() {
    return this.shortLinksRepository.findExpiredActive();
  }

  async findByPathId(shortLinkPathId: string) {
    const shortLink = await this.shortLinksRepository.findByPathId(shortLinkPathId);

    if (!shortLink) {
      throw new HttpError(HttpCodes.NotFound, 'URL with give path ID was not found');
    }

    return shortLink;
  }

  async incrementVisitsCount(shortLinkId: string) {
    return this.shortLinksRepository.incrementVisitsCounterById(shortLinkId);
  }

  async deactivateById(id: string) {
    const shortLink = await this.shortLinksRepository.findById(id);

    if (!shortLink) {
      throw new HttpError(HttpCodes.NotFound, 'Short link with given ID was not found');
    }

    await this.shortLinksRepository.deactivateById(id);

    return id;
  }
}
