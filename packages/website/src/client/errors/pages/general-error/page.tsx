import 'reflect-metadata';
import { getHomePath } from '@pcpartdb/shared';
import React from 'react';
import { MetaRobots, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';

export interface GeneralErrorPageProps {}

export const GeneralErrorPage = (_props: GeneralErrorPageProps) => {
  return (
    <WebsiteLayout>
      <Seo
        title="An unknown error has occurred"
        robots={[MetaRobots.NOINDEX]}
      />
      <article>
        <h1 className="font-semibold mb-4">An unknown error has occurred</h1>

        <p>
          Something went wrong when loading this page. Please go to our{' '}
          <a href={getHomePath()}>home page</a> and try again.
        </p>
      </article>
    </WebsiteLayout>
  );
};
