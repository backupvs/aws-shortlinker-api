import { formatJSONFailed, redirect } from '@libs/api-gateway';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import HttpError from 'src/errors/HttpError';
import { RootService } from 'src/resources/root/root.service';
import { ShortLinkService } from 'src/resources/short-link/short-link.service';

const shortLinkService = new ShortLinkService(new ShortLinksRepository());
const rootService = new RootService(shortLinkService);

export const rootHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const baseUrl = process.env.IS_OFFLINE
      ? `http://localhost:3000/${process.env.STAGE}`
      : process.env.API_BASE_URL;

    const destination = await rootService.getDestination(event.pathParameters.pathId);

    return redirect(destination);
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

export const main = rootHandler;
