export const accessLambdaRole = {
  name: 'dynamodb-access-lambdaRole',
  statements: [
    {
      Effect: 'Allow',
      Action: 'dynamodb:*',
      Resource: [
        'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.usersTable}*',
        'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.shortLinksTable}*',
      ],
    },
    {
      Effect: 'Allow',
      Action: 'sqs:*',
      Resource: [
        'arn:aws:sqs:${self:provider.region}:${aws:accountId}:${self:custom.notificationsQueue}*',
      ],
    },
  ],
};
