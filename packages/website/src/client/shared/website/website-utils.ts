import { WEBSITE_KEYWORDS, WEBSITE_NAME, WEBSITE_URL } from '@pcpartdb/shared';

export function getPageTitle(title: string) {
  return `${title} - ${WEBSITE_NAME}`;
}

export function getPageKeywords(...keywords: string[]) {
  return [...keywords, ...WEBSITE_KEYWORDS];
}

export function getPageUrl(path: string) {
  return path.startsWith('/')
    ? `${WEBSITE_URL}${path}`
    : `${WEBSITE_URL}/${path}`;
}
