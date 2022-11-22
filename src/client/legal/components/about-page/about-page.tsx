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
            <Breadcrumb>About us</Breadcrumb>
          </Breadcrumbs>

          <h1>About PC Parts DB</h1>
        </ArticleHeader>

        <section>
          <p>
            PC Parts DB was created to provide a better experience for anyone
            researching PC hardware. Our website&apos;s tools and comprehensive
            database of parts will help you make an informed choice of which
            part you should add to your PC build.
          </p>

          <p>
            We have an exciting roadmap with plans for more content and tools
            that will further help the PC community. If you have any feedback,
            questions, or requests, please reach out to our emails listed below.
            We thank you for your support.
          </p>

          <h3 className="font-medium">For advertising inquiries</h3>
          <p>advertise@pcpartsdb.com</p>

          <h3 className="font-medium">For other inquiries</h3>
          <p>hello@pcpartsdb.com</p>

          <h3 className="font-medium">Affiliate Disclaimer</h3>
          <p>
            We are a participant of affiliate advertising programs which allow
            us to earn from qualifying purchases. We do not buy or sell the
            products listed on this website.
          </p>
        </section>
      </Article>
    </WebsiteLayout>
  );
};
