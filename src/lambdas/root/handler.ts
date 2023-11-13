import { formatRedirect } from '@libs/api-gateway';
import { middify } from '@libs/middify';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { RootService } from 'src/resources/root/root.service';
import { ShortLinkService } from 'src/resources/short-link/short-link.service';

const shortLinkService = new ShortLinkService(new ShortLinksRepository());
const rootService = new RootService(shortLinkService);

export const rootHandler: APIGatewayProxyHandler = async (event) => {
  const destination = await rootService.getDestination(event.pathParameters.pathId);

  return formatRedirect(destination);
};

export const main = middify(rootHandler);
