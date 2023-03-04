import 'reflect-metadata';
import { MetaRobots } from '@pcpartdb/shared';
import React from 'react';
import { WebsiteLayout } from '../client/shared/layouts';
import { getHomePath } from '../client/shared/website';

export interface Error500PageProps {}

const Error500Page = (_props: Error500PageProps) => {
  const title = 'Sorry, we could not find that page.';
  const robots = [MetaRobots.NOINDEX];

  return (
    <WebsiteLayout seo={{ title, robots }}>
      <article>
        <h1 className="font-semibold mb-4">An unknown error has occurred.</h1>

        <p>
          Something went wrong when loading this page. Please go to our{' '}
          <a href={getHomePath()}>home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};

export default Error500Page;
