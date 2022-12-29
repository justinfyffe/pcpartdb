export const WEBSITE_NAME = 'PC Parts Database';
export const WEBSITE_URL = 'https://pcpartsdb.com';

const WEBSITE_KEYWORDS = [
  WEBSITE_NAME,
  'PC Hardware',
  'PC Parts',
  'Graphics Cards',
  'Video Cards',
  'GPUs',
];

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
