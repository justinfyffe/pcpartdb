import { WEBSITE_NAME } from '../website';

export function getAboutPath() {
  return '/about/';
}

export function getAboutUrl() {
  const path = getAboutPath();
  return `${WEBSITE_NAME}${path}`;
}

export function getPrivacyPath() {
  return '/privacy/';
}

export function getPrivacyUrl() {
  const path = getPrivacyPath();
  return `${WEBSITE_NAME}${path}`;
}
