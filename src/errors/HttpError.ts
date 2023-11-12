export default class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message = '') {
    super(message);
    this.statusCode = statusCode;
  }
}
