import { SeoInputs } from '@pcpartdb/shared';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';
import { getPageKeywords, getPageTitle, getPageUrl } from '../../website';

export interface SeoProps {
  seo?: SeoInputs;
}

export const Seo: FunctionComponent<SeoProps> = (props) => {
  const { title, keywords, description, robots, canonical } = props.seo;

  return (
    <Head>
      {title && <title>{getPageTitle(title)}</title>}
      {keywords && (
        <meta
          name="keywords"
          content={getPageKeywords(...keywords).join(', ')}
        />
      )}
      {description && <meta name="description" content={description} />}
      {robots && robots.length > 0 && (
        <meta name="robots" content={robots.join(',')} />
      )}
      {canonical && <link rel="canonical" href={getPageUrl(canonical)} />}
    </Head>
  );
};
