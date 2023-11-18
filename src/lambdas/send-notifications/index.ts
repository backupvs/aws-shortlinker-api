import { handlerPath } from '@utils/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:${self:provider.region}:${aws:accountId}:${self:custom.notificationsQueue}',
        batchSize: 10,
        enabled: true,
      },
    },
  ],
};
