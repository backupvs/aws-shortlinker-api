export const dynamoDbAccessLambdaRole = {
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
  ],
};
