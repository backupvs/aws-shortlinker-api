import { Models } from '@serverless-configs/openApiDocumentation';
import { HttpCodes } from '@utils/http-codes.enum';

export default {
  summary: 'Sign up',
  requestBody: {
    description: 'User credentials',
    required: true,
  },
  requestModels: {
    'application/json': Models.SignUpRequestBody,
  },
  methodResponses: [
    {
      statusCode: HttpCodes.Ok,
      responseBody: {
        description: 'JWE token',
      },
      responseModels: {
        'application/json': Models.SignUpResponseBody,
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
