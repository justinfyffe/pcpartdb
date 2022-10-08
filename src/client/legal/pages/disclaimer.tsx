import 'reflect-metadata';
import { Article, ArticleHeader } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

interface DisclaimerPageProps {}

export const DisclaimerPage = (_props: DisclaimerPageProps) => {
  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Disclaimer</h1>
        </ArticleHeader>
      </Article>
    </WebsiteLayout>
  );
};
