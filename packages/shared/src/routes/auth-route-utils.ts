import { WEBSITE_NAME } from '../website';

export function getForgotPasswordPath() {
  return '/forgot-password/';
}

export function getForgotPasswordUrl() {
  return `${WEBSITE_NAME}${getForgotPasswordPath()}`;
}

export function getLoginPath() {
  return '/login/';
}

export function getLoginUrl() {
  return `${WEBSITE_NAME}${getLoginPath()}`;
}

export function getRegisterPath() {
  return '/register/';
}

export function getRegisterUrl() {
  return `${WEBSITE_NAME}${getRegisterPath()}`;
}
