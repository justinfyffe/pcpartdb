import 'reflect-metadata';
import { WebsiteLayout } from '@pcpartdb/website/client/shared/layouts';
import { getHomePath } from '@pcpartdb/website/client/shared/website';
import { MetaRobots } from '@pcpartdb/website/shared/website';
import React from 'react';

export interface Error404PageProps {}

const Error404Page = (_props: Error404PageProps) => {
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

export default Error404Page;
