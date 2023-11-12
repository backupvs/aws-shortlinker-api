import { AWS } from '@serverless/typescript';
import {
  signUp,
  signIn,
  jweAuthorizer,
  createShortLink,
  getShortLinks,
  deleteShortLink,
  rootHandler,
} from '@lambdas/index';
import { esBuildConfig } from 'src/serverless/esBuildConfig';
import { dynamoDbLocalConfig } from 'src/serverless/dynamoDbLocalConfig';
import { dynamoDbAccessLambdaRole } from 'src/serverless/dynamoDbAccessLambdaRole';
import { shortLinksTable, usersTable } from 'src/serverless/dynamoDbResources';
import { FileKeysService } from 'src/common/keys-service/file-keys.service';
import { IKeysService } from 'src/common/keys-service/keys.service.interface';

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
    plugins: ['serverless-esbuild', 'serverless-dynamodb', 'serverless-offline'],
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
        JWE_EXPIRES_IN: process.env.JWE_EXPIRES_IN ?? '305000', // millis (305 seconds)
        SHORT_LINK_LENGTH: process.env.SHORT_LINK_LENGTH ?? '6',
        PUBLIC_KEY: publicKey,
        PRIVATE_KEY: privateKey,
      },
      iam: {
        role: dynamoDbAccessLambdaRole,
      },
    },
    functions: {
      jweAuthorizer,
      signUp,
      signIn,
      createShortLink,
      getShortLinks,
      deleteShortLink,
      rootHandler,
    },
    resources: {
      Resources: {
        UsersTable: usersTable,
        ShortLinksTable: shortLinksTable,
      },
    },
    package: { individually: true },
    custom: {
      usersTable: 'users-table-${sls:stage}',
      shortLinksTable: 'short-links-table-${sls:stage}',
      esbuild: esBuildConfig,
      dynamodb: dynamoDbLocalConfig,
    },
  };

  return serverlessConfiguration;
}

module.exports = createConfiguration();
