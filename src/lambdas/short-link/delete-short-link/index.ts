import { Authorizers } from '@lambdas/index';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'short-link/{id}',
        authorizer: {
          name: Authorizers.JweAuthorizer,
        },
      },
    },
  ],
};
