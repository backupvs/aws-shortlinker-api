import {
  formatJSONFailed,
  formatJSONSuccess,
  type ValidatedAPIGatewayProxyHandler,
} from '@libs/api-gateway';
import { middyfy } from '@libs/middify';

import schema from './schema';
import { HttpCodes } from '@libs/http-codes.enum';
import HttpError from 'src/errors/HttpError';
import { ShortLinkService } from 'src/resources/short-link/short-link.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';

const shortLinkService = new ShortLinkService(new ShortLinksRepository());

const createShortLink: ValidatedAPIGatewayProxyHandler<typeof schema> = async (event) => {
  try {
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
  } catch (err) {
    let statusCode = 500;
    let message = 'Internal Error';

    if (err instanceof HttpError) {
      statusCode = err.statusCode;
      message = err.message;
    }

    if (statusCode === 500) {
      console.log(err);
    }

    return formatJSONFailed(statusCode, message);
  }
};

export const main = middyfy(createShortLink);
