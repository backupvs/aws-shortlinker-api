import { formatJSONFailed, formatRedirect } from '@libs/api-gateway';
import { HttpCodes } from '@libs/http-codes.enum';
import { middify } from '@libs/middify';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { ShortLinksService } from 'src/resources/short-links/short-links.service';

const shortLinksService = new ShortLinksService(new ShortLinksRepository());

export const rootHandler: APIGatewayProxyHandler = async (event) => {
  const shortLink = await shortLinksService.findByPathId(event.pathParameters.pathId);

  if (!shortLink.isActive) {
    return formatJSONFailed(HttpCodes.Gone, 'This URL has been deactivated');
  }

  if (shortLink.isOneTime) {
    await shortLinksService.deactivateById(shortLink.shortLinkId);
  } else {
    await shortLinksService.incrementVisitsCount(shortLink.shortLinkId);
  }

  return formatRedirect(shortLink.destination);
};

export const main = middify(rootHandler);
