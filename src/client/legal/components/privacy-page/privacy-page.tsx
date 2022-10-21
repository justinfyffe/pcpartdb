import 'reflect-metadata';
import { Article, ArticleHeader } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

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
