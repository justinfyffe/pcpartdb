import 'reflect-metadata';
import { getHomePath } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo } from '../../../shared/components/Seo/Seo';
import { WebsiteLayout } from '../../../shared/layouts';

export interface GeneralErrorPageProps {}

export const GeneralErrorPage = (_props: GeneralErrorPageProps) => {
  const pageTitle = 'An unknown error has occurred';
  const seoTitle = `${pageTitle}`;
  const seoRobots = [MetaRobots.NOINDEX];

  return (
    <WebsiteLayout>
      <Seo title={seoTitle} robots={seoRobots} />
      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <p>
          Something went wrong when loading this page. Please go to our{' '}
          <a href={getHomePath()}>home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};
