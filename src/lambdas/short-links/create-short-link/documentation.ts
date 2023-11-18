import { Models } from '@serverless-configs/openApiDocumentation';
import { HttpCodes } from '@utils/http-codes.enum';

export default {
  summary: 'Create Short Link',
  security: [{ bearerToken: [] }],
  requestBody: {
    description:
      'Any URL and lifetime for short link. You can omit lifetime to create one-time link',
    required: true,
  },
  requestModels: {
    'application/json': Models.CreateShortLinkRequestBody,
  },
  methodResponses: [
    {
      statusCode: HttpCodes.Created,
      responseBody: {
        description: 'Created short URL',
      },
      responseModels: {
        'application/json': Models.CreateShortLinkResponseBody,
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
