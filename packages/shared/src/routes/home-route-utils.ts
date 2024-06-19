import { WEBSITE_NAME } from '../website';

export function getHomePath() {
  return '/';
}

export function getHomeUrl() {
  const path = getHomePath();
  return `${WEBSITE_NAME}${path}`;
}
