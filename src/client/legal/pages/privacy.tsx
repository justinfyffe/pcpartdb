import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../../shared/components/article';
import { WebsiteLayout } from '../../shared/layouts/website';

interface PrivacyPageProps {}

export const PrivacyPage = (_props: PrivacyPageProps) => {
  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>Privacy Policy</h1>
        </ArticleHeader>
      </Article>
    </WebsiteLayout>
  );
};
