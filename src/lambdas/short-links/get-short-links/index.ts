import { Authorizers } from '@lambdas/index';
import { handlerPath } from '@utils/handler-resolver';
import documentation from './documentation';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'short-links',
        authorizer: {
          name: Authorizers.JweAuthorizer,
          resultTtlInSeconds: 0,
        },
        documentation,
      },
    },
  ],
};
