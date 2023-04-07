const SCRAPING_ANT_HOST = 'https://api.scrapingant.com/v2';

export function getProxiedUrl(url: string) {
  if (process.env.SCRAPING_ANT_API_KEY == null) {
    throw new Error('Missing SCRAPING_ANT_API_KEY env variable');
  }

  const params = new URLSearchParams();
  params.set('url', url);
  params.set('browser', 'false');
  params.set('proxy_country', 'US');
  params.set('x-api-key', process.env.SCRAPING_ANT_API_KEY);

  return `${SCRAPING_ANT_HOST}/general?${params.toString()}`;
}
