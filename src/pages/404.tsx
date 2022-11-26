import 'reflect-metadata';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

export interface Error404PageProps {}

const Error404Page = (_props: Error404PageProps) => {
  return (
    <WebsiteLayout>
      <article>
        <h1 className="font-semibold mb-4">
          Sorry, we could not find that page.
        </h1>

        <p>
          The page you are looking for may not exist. Please go to our{' '}
          <a href="https://pcpartsdb.com">home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};

export default Error404Page;
