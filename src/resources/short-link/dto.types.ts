import schema from '@lambdas/short-link/create-short-link/schema';
import { FromSchema } from 'json-schema-to-ts';

export type CreateShortLinkDto = FromSchema<typeof schema>;
