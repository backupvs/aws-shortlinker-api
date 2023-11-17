import type { FromSchema } from 'json-schema-to-ts';
import signUpRequestBodySchema from '@lambdas/auth/sign-up/request-body.schema';
import signInRequestBodySchema from '@lambdas/auth/sign-in/request-body.schema';

export type SignInDto = FromSchema<typeof signUpRequestBodySchema>;
export type CreateUserDto = FromSchema<typeof signInRequestBodySchema>;
