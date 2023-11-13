import { Authorizers } from '@lambdas/index';
import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'short-links',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        authorizer: {
          name: Authorizers.JweAuthorizer,
        },
      },
    },
  ],
};
