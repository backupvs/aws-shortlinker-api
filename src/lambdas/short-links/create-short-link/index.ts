import { Authorizers } from '@lambdas/index';
import requestBodySchema from './request-body.schema';
import { handlerPath } from '@utils/handler-resolver';
import documentation from './documentation';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'short-links',
        request: {
          schemas: {
            'application/json': requestBodySchema,
          },
        },
        authorizer: {
          name: Authorizers.JweAuthorizer,
          resultTtlInSeconds: 0,
        },
        documentation,
      },
    },
  ],
};
