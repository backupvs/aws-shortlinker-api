import { Models } from 'src/serverless-configs/openApiDocumentation';
import { HttpCodes } from '@libs/http-codes.enum';

export default {
  summary: 'Create Short Link',
  security: [{ bearerToken: [] }],
  requestBody: {
    description: 'Any URL',
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
