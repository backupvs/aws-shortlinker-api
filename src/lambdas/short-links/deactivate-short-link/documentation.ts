import { Models } from '@serverless-configs/openApiDocumentation';
import { HttpCodes } from '@utils/http-codes.enum';

export default {
  summary: 'Deactivate Short Link',
  description: 'Set isActive field of specified Short Link to false',
  security: [{ bearerToken: [] }],
  pathParams: [
    {
      name: 'shortLinkId',
      description: 'Short Link ID to deactivate',
      schema: {
        type: 'string',
      },
    },
  ],
  methodResponses: [
    {
      statusCode: HttpCodes.NoContent,
      responseBody: {
        description: 'No content',
      },
      responseModels: {
        'application/json': Models.EmptyBody,
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
