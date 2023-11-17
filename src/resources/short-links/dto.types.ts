import createShortLinkRequestBodySchema from '@lambdas/short-links/create-short-link/request-body.schema';
import { FromSchema } from 'json-schema-to-ts';

export type CreateShortLinkDto = FromSchema<typeof createShortLinkRequestBodySchema>;
