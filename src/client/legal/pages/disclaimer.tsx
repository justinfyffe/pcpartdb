import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../../shared/components/article';
import { WebsiteLayout } from '../../shared/layouts/website';

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
