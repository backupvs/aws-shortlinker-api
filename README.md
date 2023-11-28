# AWS ShortLinker API

The Serverless API is designed to create short URLs and can be deployed on AWS.
This project has been developed using [Serverless framework](https://www.serverless.com/).

## Main structure

```bash
├── documentation  # OpenAPI specifications
├── scripts  # Scripts that are not directly related to project (used by npm scripts)
├── src
│  ├── common  # Services that are not directly related to any resources (hashing, tokens, email)
│  ├── database  # Database client and repositories
│  ├── errors  # Custom error classes that extends Error
│  ├── lambdas  # Lambda configuration, schemas and source code folder
│  ├── libs  # Middleware engine, response formatters and other utilities used by lambdas
│  ├── resources  # Services, entities and types that are related to specific resources
│  ├── serverless-configs  # Configs to be inserted into main serverless service file.
│  └── sqs-queue  # SQS Client
└── serverless.ts  # Serverless service file
```

## AWS Authentication

You must have an AWS account with an IAM user that has admin access policy to grant the Serverless framework the ability to deploy a CloudFormation stack and create everything it needs.

Install [AWS CLI](https://aws.amazon.com/cli/) , run `aws configure` and follow the instructions to specify user keys.

## Deploy

1. Run `npm i` to install the project dependencies
2. Run `npm generate-keys` to generate an asymmetric key pair, which allows creating JWE tokens.
3. Run:

- `npm run deploy` to deploy with _dev_ stage
- `npm run deploy -- --stage <stage>` to deploy with specific stage.
- `npm run deploy -- --verbose` to deploy with verbose logs.

Swagger UI will be available at **{stage}/swagger**.

> **NOTE**<br>
> Ensure that you only use authorized SES email entities to be able to send and receive notifications in sandbox. For more details, refer [here](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html).

## Offline

First, run `npm i` to install dependencies.

### Setup

Before running the app in offline mode, execute the following commands to spin up local services:

1. `npm generate-keys` - generate an asymmetric key pair, which allows creating JWE tokens.
2. `npm run dynamodb-local:install` - install DynamoDB local server _(requires Java Runtime Engine (JRE) version 6.x or newer)_.
3. `npm run elasticmq:run` - run Docker container with [ElastiqMQ](https://github.com/softwaremill/elasticmq) that will immitate SQS.

Swagger UI will be available at **{stage}/swagger**.

### Start

Run `npm run offline` to start app in offline mode.

> **NOTE**<br>
> Sending emails through SES in not available in offline mode. Sending will be replaced by a simple log to console with short description.
