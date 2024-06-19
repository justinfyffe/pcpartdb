import { WEBSITE_URL } from '../website';

export function getForgotPasswordPath() {
  return '/forgot-password/';
}

export function getForgotPasswordUrl() {
  return `${WEBSITE_URL}${getForgotPasswordPath()}`;
}

export function getLoginPath() {
  return '/login/';
}

export function getLoginUrl() {
  return `${WEBSITE_URL}${getLoginPath()}`;
}

export function getRegisterPath() {
  return '/register/';
}

export function getRegisterUrl() {
  return `${WEBSITE_URL}${getRegisterPath()}`;
}
