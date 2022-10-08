export enum MetaRobots {
  NOFOLLOW = 'nofollow',
  NOINDEX = 'noindex',
  NOARCHIVE = 'noarchive',
  NOSNIPPET = 'nosnippet',
}

export interface Seo {
  htmlTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  metaRobots?: MetaRobots[];
  canonical?: string;
}
