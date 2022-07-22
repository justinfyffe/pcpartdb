import 'reflect-metadata';
import React from 'react';
import { Article, ArticleHeader } from '../web/shared/components/article';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface AboutPageProps {}

const AboutPage = (_props: AboutPageProps) => {
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

export default AboutPage;
