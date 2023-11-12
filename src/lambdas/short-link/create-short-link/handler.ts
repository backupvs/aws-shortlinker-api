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
    const result = await shortLinkService.create(
      event.body,
      event.requestContext.authorizer.principalId
    );

    return formatJSONSuccess(HttpCodes.Created, result);
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
