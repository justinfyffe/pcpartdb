import { Seo as SeoDto } from '@shared/seo';
import Head from 'next/head';
import React, { FunctionComponent } from 'react';

export interface SeoProps {
  seo?: SeoDto;
}

export const Seo: FunctionComponent<SeoProps> = (props) => {
  const seo = getSeo(props);
  return (
    <Head>
      {seo.htmlTitle && <title>{seo.htmlTitle}</title>}
      {seo.metaKeywords && <meta name="keywords" content={seo.metaKeywords} />}
      {seo.metaDescription && (
        <meta name="description" content={seo.metaDescription} />
      )}
      {seo.metaRobots && seo.metaRobots.length > 0 && (
        <meta name="robots" content={seo.metaRobots.join(',')} />
      )}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
    </Head>
  );
};

function getSeo(props: SeoProps) {
  if (props.seo) {
    return props.seo;
  } else {
    return {};
  }
}
