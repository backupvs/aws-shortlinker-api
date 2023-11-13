import { formatJSONSuccess } from '@libs/api-gateway';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinkService } from 'src/resources/short-link/short-link.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { middify } from '@libs/middify';

const shortLinkService = new ShortLinkService(new ShortLinksRepository());

const deleteShortLink: APIGatewayProxyHandler = async (event) => {
  const result = await shortLinkService.deleteById(event.pathParameters.id);

  return formatJSONSuccess(HttpCodes.Ok, result);
};

export const main = middify(deleteShortLink);
