import 'reflect-metadata';
import { MetaRobots } from '@pcpartdb/shared';
import React from 'react';
import { WebsiteLayout } from '../../../shared/layouts';
import { getHomePath } from '../../../shared/website';

export interface GeneralErrorPageProps {}

export const GeneralErrorPage = (_props: GeneralErrorPageProps) => {
  const title = 'An unknown error has occurred.';
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
