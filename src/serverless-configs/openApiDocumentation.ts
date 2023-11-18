import signUpRequestBodySchema from '@lambdas/auth/sign-up/request-body.schema';
import signUpResponseBodySchema from '@lambdas/auth/sign-up/response-body.schema';
import signInRequestBodySchema from '@lambdas/auth/sign-in/request-body.schema';
import signInResponseBodySchema from '@lambdas/auth/sign-in/response-body.schema';
import createShortLinkRequestBodySchema from '@lambdas/short-links/create-short-link/request-body.schema';
import createShortLinkResponseBodySchema from '@lambdas/short-links/create-short-link/response-body.schema';
import getShortLinksResponseBodySchema from '@lambdas/short-links/get-short-links/response-body.schema';

export enum Models {
  EmptyBody = 'EmptyBody',
  ErrorResponseBody = 'ErrorResponseBody',
  SignUpRequestBody = 'SignUpRequestBody',
  SignUpResponseBody = 'SignUpResponseBody',
  SignInRequestBody = 'SignInRequestBody',
  SignInResponseBody = 'SignInResponseBody',
  CreateShortLinkRequestBody = 'CreateShortLinkRequestBody',
  CreateShortLinkResponseBody = 'CreateShortLinkResponseBody',
  GetShortLinksResponseBody = 'GetShortLinksResponseBody',
}

export const openApiDocumentation = {
  version: '1',
  title: 'Shortlinker API',
  description: 'API to make short URLs',
  servers: {
    url: '/${self:provider.stage}',
  },
  securitySchemes: {
    bearerToken: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  models: [
    {
      name: Models.ErrorResponseBody,
      contentType: 'application/json',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
        },
      },
    },
    {
      name: Models.EmptyBody,
      contentType: 'application/json',
      schema: {
        type: 'object',
        nullable: true,
      },
    },
    {
      name: Models.SignUpRequestBody,
      contentType: 'application/json',
      schema: signUpRequestBodySchema,
    },
    {
      name: Models.SignUpResponseBody,
      contentType: 'application/json',
      schema: signUpResponseBodySchema,
    },
    {
      name: Models.SignInRequestBody,
      contentType: 'application/json',
      schema: signInRequestBodySchema,
    },
    {
      name: Models.SignInResponseBody,
      contentType: 'application/json',
      schema: signInResponseBodySchema,
    },
    {
      name: Models.CreateShortLinkRequestBody,
      contentType: 'application/json',
      schema: createShortLinkRequestBodySchema,
    },
    {
      name: Models.CreateShortLinkResponseBody,
      contentType: 'application/json',
      schema: createShortLinkResponseBodySchema,
    },
    {
      name: Models.GetShortLinksResponseBody,
      contentType: 'application/json',
      schema: getShortLinksResponseBodySchema,
    },
  ],
};
