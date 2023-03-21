import { WEBSITE_NAME, WEBSITE_URL } from '@pcpartdb/shared';
import Head from 'next/head';
import React, { FunctionComponent, useMemo } from 'react';

const BASE_KEYWORDS = [
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
  return [...keywords, ...BASE_KEYWORDS];
}

function getSeoCanonical(path: string) {
  return path.startsWith('/')
    ? `${WEBSITE_URL}${path}`
    : `${WEBSITE_URL}/${path}`;
}

export const Seo: FunctionComponent<SeoProps> = (props) => {
  const { title, keywords, description, robots, canonical } = props;

  const seoTitle = useMemo(() => getSeoTitle(title), [title]);
  const seoKeywords = useMemo(
    () => getSeoKeywords(...keywords).join(', '),
    [keywords],
  );
  const seoRobots = useMemo(() => robots?.join(','), [robots]);
  const seoCanonical = useMemo(() => getSeoCanonical(canonical), [canonical]);

  return (
    <Head>
      {title != null ? (
        <title key="title">{seoTitle}</title>
      ) : (
        <title key="title">{WEBSITE_NAME}</title>
      )}
      {keywords && (
        <meta name="keywords" content={seoKeywords} key="metaKeywords" />
      )}
      {description && (
        <meta name="description" content={description} key="metaDescription" />
      )}
      {robots && robots.length > 0 && (
        <meta name="robots" content={seoRobots} key="metaRobots" />
      )}
      {canonical && (
        <link rel="canonical" href={seoCanonical} key="linkCanonical" />
      )}
    </Head>
  );
};
