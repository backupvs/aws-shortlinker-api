import { formatJSONSuccess } from '@libs/api-gateway';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinksService } from 'src/resources/short-links/short-links.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { middify } from '@libs/middify';

const shortLinksService = new ShortLinksService(new ShortLinksRepository());

const deactivateShortLink: APIGatewayProxyHandler = async (event) => {
  await shortLinksService.deactivateById(event.pathParameters.id);

  return formatJSONSuccess(HttpCodes.NoContent, {});
};

export const main = middify(deactivateShortLink);
