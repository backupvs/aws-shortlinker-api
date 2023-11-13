import { Authorizers } from '@lambdas/index';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'short-link/{id}/deactivate',
        authorizer: {
          name: Authorizers.JweAuthorizer,
        },
      },
    },
  ],
};
