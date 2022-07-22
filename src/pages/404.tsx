import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../web/shared/components/article';
import { WebsiteLayout } from '../web/shared/layouts/website';

export interface Error404PageProps {}

const Error404Page = (_props: Error404PageProps) => {
  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Sorry, we could not find that page.</h1>
        </ArticleHeader>

        <p>
          The page you are looking for may not exist. Please go to our{' '}
          <a href="https://finestpc.com">home page</a> and try again.
        </p>
      </Article>
    </WebsiteLayout>
  );
};

export default Error404Page;
