import { formatJSONSuccess, ValidatedAPIGatewayProxyHandler } from '@utils/api-gateway';
import { middify } from '@utils/middify';

import requestSchema from './request-body.schema';
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

const signIn: ValidatedAPIGatewayProxyHandler<typeof requestSchema> = async (event) => {
  const token = await authService.signIn(event.body);

  return formatJSONSuccess(HttpCodes.Ok, { token });
};

export const main = middify(signIn);
