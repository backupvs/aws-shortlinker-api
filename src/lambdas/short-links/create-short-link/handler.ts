import {
  formatJSONSuccess,
  type ValidatedAPIGatewayProxyHandler,
} from '@utils/api-gateway';
import { middify } from '@utils/middify';
import requestBodySchema from './request-body.schema';
import { HttpCodes } from '@utils/http-codes.enum';
import { ShortLinksService } from '@resources/short-links/short-links.service';
import { ShortLinksRepository } from '@database/repositories/short-links.repository';

const shortLinksService = new ShortLinksService(new ShortLinksRepository());

const createShortLink: ValidatedAPIGatewayProxyHandler<typeof requestBodySchema> = async (
  event
) => {
  const baseUrl = process.env.API_BASE_URL;
  const pathId = await shortLinksService.create(
    event.body,
    event.requestContext.authorizer.principalId
  );

  return formatJSONSuccess(HttpCodes.Created, {
    shortLink: `${baseUrl}/${pathId}`,
  });
};

export const main = middify(createShortLink);
