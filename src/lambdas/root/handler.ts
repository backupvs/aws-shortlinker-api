import { formatJSONFailed, formatRedirect } from '@utils/api-gateway';
import { HttpCodes } from '@utils/http-codes.enum';
import { middify } from '@utils/middify';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ShortLinksRepository } from '@database/repositories/short-links.repository';
import { ShortLinksService } from '@resources/short-links/short-links.service';

const shortLinksService = new ShortLinksService(new ShortLinksRepository());

export const rootHandler: APIGatewayProxyHandler = async (event) => {
  const { shortLinkId, isOneTime, isActive, destination } =
    await shortLinksService.findByPathId(event.pathParameters.pathId);

  if (!isActive) {
    return formatJSONFailed(HttpCodes.Gone, 'This URL has been deactivated');
  }

  if (isOneTime) {
    await shortLinksService.deactivateById(shortLinkId);
  } else {
    await shortLinksService.incrementVisitsCount(shortLinkId);
  }

  return formatRedirect(destination, { destination });
};

export const main = middify(rootHandler);
