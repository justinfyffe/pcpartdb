import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../web/shared/components/article';
import { WebsiteLayout } from '../web/shared/layouts/website';

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
