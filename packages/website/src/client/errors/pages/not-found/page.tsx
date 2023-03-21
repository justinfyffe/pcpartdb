import 'reflect-metadata';
import { getHomePath } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';

export interface NotFoundPageProps {}

export const NotFoundPage = (_props: NotFoundPageProps) => {
  return (
    <WebsiteLayout>
      <Seo
        title="Sorry, we could not find that page"
        robots={[MetaRobots.NOINDEX]}
      />
      <article>
        <h1 className="font-semibold mb-4">
          Sorry, we could not find that page
        </h1>

        <p>
          The page you are looking for may not exist. Please go to our{' '}
          <a href={getHomePath()}>home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};
