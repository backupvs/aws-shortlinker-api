import { AWS } from '@serverless/typescript';
import { cleanEnv as validateEnv, num, email } from 'envalid';
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
import { IKeysService, Keys } from 'src/common/keys-service/keys.service.interface';
import { sqsLocalConfig } from 'src/serverless-configs/sqsLocalConfig';
import { notificationsQueueResource } from 'src/serverless-configs/notificationsQueueResource';
import { eventBridgeLocalConfig } from 'src/serverless-configs/eventBridgeLocalConfig';

validateEnv(process.env, {
  JWE_EXPIRES_IN: num(),
  SHORT_LINK_LENGTH: num(),
  SES_SENDER_EMAIL: email(),
});

async function createConfiguration() {
  let keys: Keys;
  try {
    const keysService: IKeysService = new FileKeysService('./.keys');
    keys = await keysService.importKeys();
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
      'serverless-offline-aws-eventbridge',
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
        JWE_EXPIRES_IN: process.env.JWE_EXPIRES_IN,
        SHORT_LINK_LENGTH: process.env.SHORT_LINK_LENGTH,
        SES_SENDER_EMAIL: process.env.SES_SENDER_EMAIL,
        PUBLIC_KEY: keys.publicKey,
        PRIVATE_KEY: keys.privateKey,
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
        NotificationsQueue: notificationsQueueResource,
      },
    },
    package: { individually: true },
    custom: {
      usersTable: 'users-table-${self:provider.stage}',
      shortLinksTable: 'short-links-table-${self:provider.stage}',
      notificationsQueue: 'notifications-queue-${self:provider.stage}',
      notificationsQueueUrl:
        'https://sqs.${self:provider.region}.amazonaws.com/${aws:accountId}/${self:custom.notificationsQueue}',
      esbuild: esBuildConfig,
      dynamodb: dynamoDbLocalConfig,
      'serverless-offline-sqs': sqsLocalConfig,
      'serverless-offline-aws-eventbridge': eventBridgeLocalConfig,
    },
  };

  return serverlessConfiguration;
}

module.exports = createConfiguration();
