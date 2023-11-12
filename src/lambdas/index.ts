export enum Lambdas {
  JweAuthorizer = 'jweAuthorizer',
  SignUp = 'signUp',
  SignIn = 'signIn',
  CreateShortLink = 'createShortLink',
  GetShortLinks = 'getShortLinks',
  DeleteShortLink = 'deleteShortLink',
}

export { default as jweAuthorizer } from './jwe-authorizer';
export { default as signUp } from './auth/sign-up';
export { default as signIn } from './auth/sign-in';
export { default as createShortLink } from './short-link/create-short-link';
export { default as getShortLinks } from './short-link/get-short-links';
export { default as deleteShortLink } from './short-link/delete-short-link';
