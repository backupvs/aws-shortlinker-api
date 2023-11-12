import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { HttpCodes } from './http-codes.enum';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};

export type ValidatedAPIGatewayProxyHandler<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONSuccess = (
  statusCode: HttpCodes,
  response: Record<string, any>
) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};

export const formatJSONFailed = (statusCode: HttpCodes, errorMsg: string) => {
  return {
    statusCode,
    body: JSON.stringify({
      message: errorMsg,
    }),
  };
};

export const redirect = (destinationUrl: string) => {
  return {
    statusCode: 301,
    headers: {
      Location: destinationUrl,
    },
    body: '',
  };
};
