import type { FromSchema } from 'json-schema-to-ts';
import signUpSchema from '@lambdas/auth/sign-up/schema';
import signInSchema from '@lambdas/auth/sign-in/schema';

export type SignInDto = FromSchema<typeof signUpSchema>;
export type CreateUserDto = FromSchema<typeof signInSchema>;
