import { WEBSITE_URL } from '../website';

export function getHomePath() {
  return '/';
}

export function getHomeUrl() {
  const path = getHomePath();
  return `${WEBSITE_URL}${path}`;
}
