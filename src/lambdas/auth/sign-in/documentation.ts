import { Models } from 'src/serverless-configs/openApiDocumentation';
import { HttpCodes } from '@libs/http-codes.enum';

export default {
  summary: 'Sign in',
  requestBody: {
    description: 'User credentials',
    required: true,
  },
  requestModels: {
    'application/json': Models.SignInRequestBody,
  },
  methodResponses: [
    {
      statusCode: HttpCodes.Ok,
      responseBody: {
        description: 'JWE token',
      },
      responseModels: {
        'application/json': Models.SignInResponseBody,
      },
    },
    {
      statusCode: HttpCodes.Unauthorized,
      responseBody: {
        description: 'An error message when credentials are invalid',
      },
      responseModels: {
        'application/json': Models.ErrorResponseBody,
      },
    },
  ],
};
