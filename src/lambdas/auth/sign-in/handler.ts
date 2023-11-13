import { formatJSONSuccess, ValidatedAPIGatewayProxyHandler } from '@libs/api-gateway';
import { middify } from '@libs/middify';

import schema from './schema';
import { AuthService } from 'src/resources/auth/auth.service';
import { UsersRepository } from 'src/database/repositories/users.repository';
import { HttpCodes } from '@libs/http-codes.enum';
import { ScryptHashService } from 'src/common/hash-service/scrypt-hash.service';
import { JweTokenService } from 'src/common/token-service/jwe.service';

const authService = new AuthService(
  new UsersRepository(),
  new ScryptHashService(),
  new JweTokenService()
);

const signIn: ValidatedAPIGatewayProxyHandler<typeof schema> = async (event) => {
  const token = await authService.signIn(event.body);

  return formatJSONSuccess(HttpCodes.Ok, { token });
};

export const main = middify(signIn);
