export const notificationsQueueResource = {
  Type: 'AWS::SQS::Queue',
  Properties: {
    QueueName: '${self:custom.notificationsQueue}',
  },
};
