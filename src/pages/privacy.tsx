import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../client/shared/components/article';
import { WebsiteLayout } from '../client/shared/layouts/website';

interface PrivacyPageProps {}

const PrivacyPage = (_props: PrivacyPageProps) => {
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

export default PrivacyPage;
