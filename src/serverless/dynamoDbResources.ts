// TODO global tables

export const usersTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:custom.usersTable}',
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'email',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'emailIndex',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
};

export const shortLinksTable = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: '${self:custom.shortLinksTable}',
    AttributeDefinitions: [
      {
        AttributeName: 'shortLinkId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'ownerId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'pathId',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'shortLinkId',
        KeyType: 'HASH',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'ownerIdIndex',
        KeySchema: [
          {
            AttributeName: 'ownerId',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
      {
        IndexName: 'pathIdIndex',
        KeySchema: [
          {
            AttributeName: 'pathId',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
};
