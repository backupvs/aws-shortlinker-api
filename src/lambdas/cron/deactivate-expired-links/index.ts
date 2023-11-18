import { handlerPath } from '@utils/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      eventBridge: {
        schedule: 'cron(0 * * * ? *)', // every hour
      },
    },
  ],
};
