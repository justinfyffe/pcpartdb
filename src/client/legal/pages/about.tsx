import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../../shared/components/article';
import { WebsiteLayout } from '../../shared/layouts/website';

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
