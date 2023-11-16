import { AWS } from '@serverless/typescript';
import {
  signUp,
  signIn,
  jweAuthorizer,
  createShortLink,
  getShortLinks,
  deactivateShortLink,
  rootHandler,
  deactivateExpiredShortLinks,
  sendNotifications,
} from '@lambdas/index';
import { esBuildConfig } from 'src/serverless-configs/esBuildConfig';
import { dynamoDbLocalConfig } from 'src/serverless-configs/dynamoDbLocalConfig';
import { accessLambdaRole } from 'src/serverless-configs/accessLambdaRole';
import { shortLinksTable, usersTable } from 'src/serverless-configs/dynamoDbResources';
import { FileKeysService } from 'src/common/keys-service/file-keys.service';
import { IKeysService } from 'src/common/keys-service/keys.service.interface';
import { sqsLocalConfig } from 'src/serverless-configs/sqsLocalConfig';

async function createConfiguration() {
  let publicKey: string;
  let privateKey: string;
  try {
    const keysService: IKeysService = new FileKeysService('.keys');
    publicKey = await keysService.getPublicKey();
    privateKey = await keysService.getPrivateKey();
  } catch (err) {
    console.error('Error while importing keys: ', err);
    process.exit(1);
  }

  const serverlessConfiguration: AWS = {
    service: 'aws-shortlinker-api',
    frameworkVersion: '3',
    plugins: [
      'serverless-esbuild',
      'serverless-dynamodb',
      'serverless-offline-sqs',
      'serverless-offline',
    ],
    configValidationMode: 'error',
    provider: {
      name: 'aws',
      region: 'eu-central-1',
      runtime: 'nodejs18.x',
      stage: '${opt:stage, "dev"}',
      apiGateway: {
        minimumCompressionSize: 1024,
        shouldStartNameWithService: true,
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        STAGE: '${self:provider.stage}',
        REGION: '${self:provider.region}',
        API_BASE_URL: {
          'Fn::Join': [
            '',
            [
              'https://',
              { Ref: 'ApiGatewayRestApi' },
              '.execute-api.${self:provider.region}.amazonaws.com/${self:provider.stage}',
            ],
          ],
        },
        USERS_TABLE: '${self:custom.usersTable}',
        SHORT_LINKS_TABLE: '${self:custom.shortLinksTable}',
        NOTIFICATIONS_QUEUE_URL: '${self:custom.notificationsQueueUrl}',
        JWE_EXPIRES_IN: process.env.JWE_EXPIRES_IN ?? '305000', // millis (305 seconds)
        SHORT_LINK_LENGTH: process.env.SHORT_LINK_LENGTH ?? '6',
        PUBLIC_KEY: publicKey,
        PRIVATE_KEY: privateKey,
      },
      iam: {
        role: accessLambdaRole,
      },
    },
    functions: {
      jweAuthorizer,
      signUp,
      signIn,
      createShortLink,
      getShortLinks,
      deactivateShortLink,
      rootHandler,
      deactivateExpiredShortLinks,
      sendNotifications,
    },
    resources: {
      Resources: {
        UsersTable: usersTable,
        ShortLinksTable: shortLinksTable,
        NotificationsQueue: {
          Type: 'AWS::SQS::Queue',
          Properties: {
            QueueName: '${self:custom.notificationsQueue}',
            FifoQueue: true,
          },
        },
      },
    },
    package: { individually: true },
    custom: {
      usersTable: 'users-table-${self:provider.stage}',
      shortLinksTable: 'short-links-table-${self:provider.stage}',
      notificationsQueue: 'notifications-queue-${self:provider.stage}.fifo',
      notificationsQueueUrl:
        'https://sqs.${self:provider.region}.amazonaws.com/${aws:accountId}/${self:custom.notificationsQueue}',
      esbuild: esBuildConfig,
      dynamodb: dynamoDbLocalConfig,
      'serverless-offline-sqs': sqsLocalConfig,
    },
  };

  return serverlessConfiguration;
}

module.exports = createConfiguration();
