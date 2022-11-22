import 'reflect-metadata';
import {
  Article,
  ArticleHeader,
  Breadcrumb,
  Breadcrumbs,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import React from 'react';

interface AboutPageProps {}

export const AboutPage = (_props: AboutPageProps) => {
  return (
    <WebsiteLayout>
      <Article className="flex flex-wrap gap-6 lg:gap-8">
        <ArticleHeader className="flex flex-wrap w-full items-center justify-between gap-3 lg:gap-4">
          <Breadcrumbs className="mb-3">
            <Breadcrumb href="/">Home</Breadcrumb>
            <Breadcrumb>About PC Parts DB</Breadcrumb>
          </Breadcrumbs>

          <h1>About Us</h1>
        </ArticleHeader>

        <section>
          <p></p>

          <p>
            <h3 className="font-bold">For advertising inquiries:</h3>
            advertise@pcpartsdb.com
          </p>

          <p>
            <h3 className="font-bold">For other inquiries:</h3>
            hello@pcpartsdb.com
          </p>
        </section>
      </Article>
    </WebsiteLayout>
  );
};
