import { formatJSONSuccess } from '@libs/api-gateway';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinkService } from 'src/resources/short-link/short-link.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { middify } from '@libs/middify';

const shortLinkService = new ShortLinkService(new ShortLinksRepository());

const getShortLinks: APIGatewayProxyHandler = async (event) => {
  const result = await shortLinkService.getByOwnerId(
    event.requestContext.authorizer.principalId
  );

  return formatJSONSuccess(HttpCodes.Ok, {
    data: result,
  });
};

export const main = middify(getShortLinks);
