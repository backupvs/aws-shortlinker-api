import { formatJSONSuccess } from '@libs/api-gateway';
import { HttpCodes } from '@libs/http-codes.enum';
import { ShortLinksService } from 'src/resources/short-links/short-links.service';
import { ShortLinksRepository } from 'src/database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { middify } from '@libs/middify';

const shortLinkService = new ShortLinksService(new ShortLinksRepository());

const getShortLinks: APIGatewayProxyHandler = async (event) => {
  const result = await shortLinkService.getByOwnerId(
    event.requestContext.authorizer.principalId
  );

  const baseUrl = process.env.IS_OFFLINE
    ? `http://localhost:3000/${process.env.STAGE}`
    : process.env.API_BASE_URL;

  // Attach full short link url to each object
  const shortLinksWithUrl = result.map((shortLink) => ({
    ...shortLink,
    url: `${baseUrl}/${shortLink.pathId}`,
  }));

  return formatJSONSuccess(HttpCodes.Ok, {
    data: shortLinksWithUrl,
  });
};

export const main = middify(getShortLinks);
