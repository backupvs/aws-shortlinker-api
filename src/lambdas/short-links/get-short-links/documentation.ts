import { Models } from '@serverless-configs/openApiDocumentation';
import { HttpCodes } from '@utils/http-codes.enum';

export default {
  summary: 'Get Short Links',
  security: [{ bearerToken: [] }],
  methodResponses: [
    {
      statusCode: HttpCodes.Ok,
      responseBody: {
        description: 'List of Short Link objects',
      },
      responseModels: {
        'application/json': Models.GetShortLinksResponseBody,
      },
    },
    {
      statusCode: HttpCodes.Unauthorized,
      responseBody: {
        description: 'An error message when token is missing',
      },
      responseModels: {
        'application/json': Models.ErrorResponseBody,
      },
    },
    {
      statusCode: HttpCodes.Forbidden,
      responseBody: {
        description: 'An error message when token is invalid',
      },
      responseModels: {
        'application/json': Models.ErrorResponseBody,
      },
    },
  ],
};
