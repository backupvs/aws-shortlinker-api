import { formatJSONSuccess } from '@utils/api-gateway';
import { HttpCodes } from '@utils/http-codes.enum';
import { ShortLinksService } from '@resources/short-links/short-links.service';
import { ShortLinksRepository } from '@database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { middify } from '@utils/middify';

const shortLinksService = new ShortLinksService(new ShortLinksRepository());

const deactivateShortLink: APIGatewayProxyHandler = async (event) => {
  await shortLinksService.deactivateById(event.pathParameters.shortLinkId);

  return formatJSONSuccess(HttpCodes.NoContent, {});
};

export const main = middify(deactivateShortLink);
