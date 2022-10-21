import 'reflect-metadata';
import { Article, ArticleHeader } from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

interface AboutPageProps {}

export const AboutPage = (_props: AboutPageProps) => {
  return (
    <WebsiteLayout>
      <Article>
        <ArticleHeader>
          <h1>About Us</h1>
        </ArticleHeader>
      </Article>
    </WebsiteLayout>
  );
};
