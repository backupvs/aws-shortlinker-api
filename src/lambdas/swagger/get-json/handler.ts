import { HttpCodes } from '@utils/http-codes.enum';
import { middify } from '@utils/middify';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONSuccess } from '@utils/api-gateway';
import docsJson from '../../../../documentation/openapi.json';

const swaggerJSON: APIGatewayProxyHandler = async (_) => {
  return formatJSONSuccess(HttpCodes.Ok, docsJson);
};

export const main = middify(swaggerJSON);
