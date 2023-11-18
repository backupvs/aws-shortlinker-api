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

export const formatJSONSuccess = (statusCode: HttpCodes, body: Record<string, any>) => {
  return {
    statusCode,
    body: JSON.stringify(body),
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

export const formatRedirect = (destinationUrl: string, body: Record<string, any>) => {
  return {
    statusCode: HttpCodes.MovedPermanently,
    headers: {
      Location: destinationUrl,
    },
    body: JSON.stringify(body),
  };
};

export const formatHTML = (html: string) => {
  return {
    statusCode: HttpCodes.Ok,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };
};
