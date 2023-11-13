import {
  formatJSONSuccess,
  type ValidatedAPIGatewayProxyHandler,
} from '@libs/api-gateway';
import { middify } from '@libs/middify';
import schema from './schema';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinksService } from 'src/resources/short-links/short-links.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';

const shortLinkService = new ShortLinksService(new ShortLinksRepository());

const createShortLink: ValidatedAPIGatewayProxyHandler<typeof schema> = async (event) => {
  const baseUrl = process.env.IS_OFFLINE
    ? `http://localhost:3000/${process.env.STAGE}`
    : process.env.API_BASE_URL;

  const pathId = await shortLinkService.create(
    event.body,
    event.requestContext.authorizer.principalId
  );

  return formatJSONSuccess(HttpCodes.Created, {
    shortLink: `${baseUrl}/${pathId}`,
  });
};

export const main = middify(createShortLink);
