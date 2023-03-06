import 'reflect-metadata';
import { MetaRobots } from '@pcpartdb/shared';
import React from 'react';
import { WebsiteLayout } from '../../../shared/layouts';
import { getHomePath } from '../../../shared/website';

export interface NotFoundPageProps {}

export const NotFoundPage = (_props: NotFoundPageProps) => {
  const title = 'Sorry, we could not find that page.';
  const robots = [MetaRobots.NOINDEX];

  return (
    <WebsiteLayout seo={{ title, robots }}>
      <article>
        <h1 className="font-semibold mb-4">
          Sorry, we could not find that page.
        </h1>

        <p>
          The page you are looking for may not exist. Please go to our{' '}
          <a href={getHomePath()}>home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};
