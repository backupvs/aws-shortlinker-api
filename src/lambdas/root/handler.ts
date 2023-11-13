import { formatRedirect } from '@libs/api-gateway';
import { middify } from '@libs/middify';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { RootService } from 'src/resources/root/root.service';

const rootService = new RootService(new ShortLinksRepository());

export const rootHandler: APIGatewayProxyHandler = async (event) => {
  const shortLink = await rootService.findByPathId(event.pathParameters.pathId);
  await rootService.incrementVisitsCount(shortLink.shortLinkId);

  return formatRedirect(shortLink.destination);
};

export const main = middify(rootHandler);
