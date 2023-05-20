import { joinUrlParts, WEBSITE_NAME, WEBSITE_URL } from '@pcpartdb/shared';
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
  rawTitle?: string;
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
  return joinUrlParts(WEBSITE_URL, path);
}

export const Seo: FunctionComponent<SeoProps> = (props) => {
  const { title, rawTitle, keywords, description, robots, canonical } = props;

  const seoTitle = useMemo(
    () => (rawTitle || title ? rawTitle || getSeoTitle(title) : null),
    [rawTitle, title],
  );
  const seoKeywords = useMemo(
    () => (keywords != null ? getSeoKeywords(...keywords).join(', ') : null),
    [keywords],
  );
  const seoRobots = useMemo(
    () => (robots != null ? robots.join(',') : null),
    [robots],
  );
  const seoCanonical = useMemo(
    () => (canonical != null ? getSeoCanonical(canonical) : null),
    [canonical],
  );

  return (
    <Head>
      {seoTitle != null ? (
        <title key="title">{seoTitle}</title>
      ) : (
        <title key="title">{WEBSITE_NAME}</title>
      )}
      {seoKeywords && (
        <meta name="keywords" content={seoKeywords} key="metaKeywords" />
      )}
      {description && (
        <meta name="description" content={description} key="metaDescription" />
      )}
      {seoRobots && <meta name="robots" content={seoRobots} key="metaRobots" />}
      {seoCanonical && (
        <link rel="canonical" href={seoCanonical} key="linkCanonical" />
      )}
    </Head>
  );
};
