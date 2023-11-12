import { formatJSONFailed, formatJSONSuccess } from '@libs/api-gateway';

import { HttpCodes } from '@libs/http-codes.enum';
import HttpError from 'src/errors/HttpError';
import { ShortLinkService } from 'src/resources/short-link/short-link.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';

const shortLinkService = new ShortLinkService(new ShortLinksRepository());

const deleteShortLink: APIGatewayProxyHandler = async (event) => {
  try {
    const result = await shortLinkService.deleteById(event.pathParameters.id);

    return formatJSONSuccess(HttpCodes.Ok, result);
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

export const main = deleteShortLink;
