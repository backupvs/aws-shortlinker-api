import { formatJSONSuccess, ValidatedAPIGatewayProxyHandler } from '@utils/api-gateway';
import { middify } from '@utils/middify';

import requestBodySchema from './request-body.schema';
import { AuthService } from '@resources/auth/auth.service';
import { UsersRepository } from '@database/repositories/users.repository';
import { HttpCodes } from '@utils/http-codes.enum';
import { ScryptHashService } from '@common/hash-service/scrypt-hash.service';
import { JweTokenService } from '@common/token-service/jwe.service';

const authService = new AuthService(
  new UsersRepository(),
  new ScryptHashService(),
  new JweTokenService()
);

const signUp: ValidatedAPIGatewayProxyHandler<typeof requestBodySchema> = async (
  event
) => {
  const token = await authService.signUp(event.body);

  return formatJSONSuccess(HttpCodes.Created, { token });
};

export const main = middify(signUp);
