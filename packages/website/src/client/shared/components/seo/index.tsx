import { WEBSITE_NAME, WEBSITE_URL } from '@pcpartdb/shared';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

const WEBSITE_KEYWORDS = [
  'PC Part DB',
  'PC Hardware',
  'PC Parts',
  'Graphics Cards',
  'Video Cards',
  'GPUs',
];

export enum MetaRobots {
  NOFOLLOW = 'nofollow',
  NOINDEX = 'noindex',
  NOARCHIVE = 'noarchive',
  NOSNIPPET = 'nosnippet',
}

export interface SeoProps {
  title?: string;
  keywords?: string[];
  description?: string;
  robots?: MetaRobots[];
  canonical?: string;
}

function getSeoTitle(title: string) {
  return `${title} - ${WEBSITE_NAME}`;
}

function getSeoKeywords(...keywords: string[]) {
  return [...keywords, ...WEBSITE_KEYWORDS];
}

function getSeoCanonical(path: string) {
  return path.startsWith('/')
    ? `${WEBSITE_URL}${path}`
    : `${WEBSITE_URL}/${path}`;
}

export const Seo: FunctionComponent<SeoProps> = (props) => {
  const { title, keywords, description, robots, canonical } = props;

  return (
    <Head>
      {title && <title>{getSeoTitle(title)}</title>}
      {keywords && (
        <meta
          name="keywords"
          content={getSeoKeywords(...keywords).join(', ')}
        />
      )}
      {description && <meta name="description" content={description} />}
      {robots && robots.length > 0 && (
        <meta name="robots" content={robots.join(',')} />
      )}
      {canonical && <link rel="canonical" href={getSeoCanonical(canonical)} />}
    </Head>
  );
};
