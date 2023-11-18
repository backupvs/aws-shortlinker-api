import { Authorizers } from '@lambdas/index';
import { handlerPath } from '@utils/handler-resolver';
import documentation from './documentation';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'short-links/{shortLinkId}/deactivate',
        authorizer: {
          name: Authorizers.JweAuthorizer,
          resultTtlInSeconds: 0,
        },
        documentation,
      },
    },
  ],
};
