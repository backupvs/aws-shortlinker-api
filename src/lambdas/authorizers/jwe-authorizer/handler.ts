import { APIGatewayTokenAuthorizerHandler, PolicyDocument } from 'aws-lambda';
import { IJwtService } from 'src/common/token-service/jwt.service.interface';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { JweTokenService } from 'src/common/token-service/jwe.service';

const jsonTokenService: IJwtService = new JweTokenService();
const usersRepository = new UsersRepository();

export const jweAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  const authHeader = event.authorizationToken;
  const token = authHeader.split(' ')[1];

  const payload = await jsonTokenService.verify<{ userId: string }>(
    token,
    process.env.PRIVATE_KEY
  );

  if (!payload) {
    return {
      principalId: null,
      policyDocument: generateInvokePolicy('Deny', event.methodArn),
    };
  }

  const user = await usersRepository.findById(payload.userId);
  if (!user) {
    return {
      principalId: null,
      policyDocument: generateInvokePolicy('Deny', event.methodArn),
    };
  }

  return {
    principalId: payload.userId,
    policyDocument: generateInvokePolicy('Allow', event.methodArn),
  };
};

function generateInvokePolicy(effect: 'Allow' | 'Deny', arn: string): PolicyDocument {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: arn,
      },
    ],
  };
}

export const main = jweAuthorizer;
