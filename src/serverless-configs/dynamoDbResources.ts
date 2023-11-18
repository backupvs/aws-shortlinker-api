const tableType = process.env.LAUNCH_MODE === 'deploy' ? 'GlobalTable' : 'Table';

export const usersTable = {
  Type: `AWS::DynamoDB::${tableType}`,
  Properties: {
    TableName: '${self:custom.usersTable}',
    Replicas: [
      {
        Region: '${self:provider.region}',
      },
      {
        Region: 'us-east-1',
      },
    ],
    StreamSpecification: {
      StreamViewType: 'NEW_AND_OLD_IMAGES',
    },
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
  Type: `AWS::DynamoDB::${tableType}`,
  Properties: {
    TableName: '${self:custom.shortLinksTable}',
    Replicas: [
      {
        Region: '${self:provider.region}',
      },
      {
        Region: 'us-east-1',
      },
    ],
    StreamSpecification: {
      StreamViewType: 'NEW_AND_OLD_IMAGES',
    },
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
