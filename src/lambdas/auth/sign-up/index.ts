import requestSchema from './request-body.schema';
import { handlerPath } from '@utils/handler-resolver';
import documentation from './documentation';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'auth/sign-up',
        request: {
          schemas: {
            'application/json': requestSchema,
          },
        },
        documentation,
      },
    },
  ],
};
