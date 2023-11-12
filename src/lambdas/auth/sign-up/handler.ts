import {
  formatJSONFailed,
  formatJSONSuccess,
  ValidatedAPIGatewayProxyHandler,
} from '@libs/api-gateway';
import { middyfy } from '@libs/middify';

import schema from './schema';
import { AuthService } from 'src/resources/auth/auth.service';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { HttpCodes } from '@libs/http-codes.enum';
import HttpError from 'src/errors/HttpError';
import { ScryptHashService } from 'src/common/hash-service/scrypt-hash.service';
import { JweTokenService } from 'src/common/token-service/jwe.service';

const authService = new AuthService(
  new UsersRepository(),
  new ScryptHashService(),
  new JweTokenService()
);

const signUp: ValidatedAPIGatewayProxyHandler<typeof schema> = async (event) => {
  try {
    const token = await authService.signUp(event.body);
    return formatJSONSuccess(HttpCodes.Created, { token });
  } catch (err) {
    let statusCode = 500;
    let message = 'Internal Error';

    if (err instanceof HttpError) {
      statusCode = err.statusCode;
      message = err.message;
    }

    if (statusCode === 500) {
      console.log(err);
    }

    return formatJSONFailed(statusCode, message);
  }
};

export const main = middyfy(signUp);
