import 'reflect-metadata';
import { getHomePath } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo } from '../../../shared/components/Seo/Seo';
import { WebsiteLayout } from '../../../shared/layouts';

export interface NotFoundPageProps {}

export const NotFoundPage = (_props: NotFoundPageProps) => {
  const pageTitle = 'Sorry, we could not find that page';
  const seoTitle = `${pageTitle}`;
  const seoRobots = [MetaRobots.NOINDEX];

  return (
    <WebsiteLayout>
      <Seo title={seoTitle} robots={seoRobots} />
      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <p>
          The page you are looking for may not exist. Please go to our{' '}
          <a href={getHomePath()}>home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};
