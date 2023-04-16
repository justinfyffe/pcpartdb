export function cleanUrl(url: string) {
  const queryIndex = url.indexOf('?');
  const query = queryIndex >= 0 ? url.substring(queryIndex) : '';
  const urlBeforeQuery = queryIndex >= 0 ? url.substring(0, queryIndex) : url;

  const cleanedUrlBeforeQuery =
    urlBeforeQuery.startsWith('http://') ||
    urlBeforeQuery.startsWith('https://')
      ? urlBeforeQuery.replace(/([^:]\/)\/+/g, '$1')
      : urlBeforeQuery.replace(/(\/)+/g, '$1');

  return `${cleanedUrlBeforeQuery}${query}`;
}
