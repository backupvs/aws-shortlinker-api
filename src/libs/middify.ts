import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import HttpError from 'src/errors/HttpError';
import { formatJSONFailed } from './api-gateway';
import { HttpCodes } from './http-codes.enum';

const middlewares: middy.MiddlewareObj[] = [middyJsonBodyParser()];

const onError: middy.MiddlewareFn<any, any, Error | HttpError> = (request) => {
  const { error } = request;

  if (error instanceof HttpError) {
    return formatJSONFailed(error.statusCode, error.message);
  } else {
    console.error(error);
    return formatJSONFailed(HttpCodes.InternalError, 'Internal Error');
  }
};

export const middify = (handler) => {
  return middy(handler).use(middlewares).onError(onError);
};
