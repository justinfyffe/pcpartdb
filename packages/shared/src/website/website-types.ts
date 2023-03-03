export enum MetaRobots {
  NOFOLLOW = 'nofollow',
  NOINDEX = 'noindex',
  NOARCHIVE = 'noarchive',
  NOSNIPPET = 'nosnippet',
}

export interface SeoInputs {
  title?: string;
  keywords?: string[];
  description?: string;
  robots?: MetaRobots[];
  canonical?: string;
}
