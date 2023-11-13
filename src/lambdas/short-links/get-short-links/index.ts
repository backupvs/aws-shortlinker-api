import { Authorizers } from '@lambdas/index';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'short-links',
        authorizer: {
          name: Authorizers.JweAuthorizer,
        },
      },
    },
  ],
};
