import { formatJSONSuccess } from '@utils/api-gateway';
import { HttpCodes } from '@utils/http-codes.enum';
import { ShortLinksService } from '@resources/short-links/short-links.service';
import { ShortLinksRepository } from '@database/repositories/short-links.repository';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { middify } from '@utils/middify';

const shortLinksService = new ShortLinksService(new ShortLinksRepository());

const getShortLinks: APIGatewayProxyHandler = async (event) => {
  const baseUrl = process.env.API_BASE_URL;
  const result = await shortLinksService.findByOwnerId(
    event.requestContext.authorizer.principalId
  );

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
