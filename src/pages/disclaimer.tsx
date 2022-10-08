import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../client/shared/components/article';
import { WebsiteLayout } from '../client/shared/layouts/website';

interface DisclaimerPageProps {}

const DisclaimerPage = (_props: DisclaimerPageProps) => {
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

export default DisclaimerPage;
