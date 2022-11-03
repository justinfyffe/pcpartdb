import 'reflect-metadata';
import { Article, ArticleHeader } from '@client/shared/components/article';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

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
          <a href="https://pcpartsdb.com">home page</a> and try again.
        </p>
      </Article>
    </WebsiteLayout>
  );
};

export default Error404Page;
