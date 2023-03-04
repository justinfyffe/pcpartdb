import 'reflect-metadata';
import { WEBSITE_NAME } from '@pcpartdb/shared/website';
import React from 'react';
import { Breadcrumb, Breadcrumbs } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';

interface AboutPageProps {}

export const AboutPage = (_props: AboutPageProps) => {
  const title = 'About Us';
  const canonical = '/about';
  const keywords: string[] = [];

  return (
    <WebsiteLayout seo={{ title, canonical, keywords }}>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb>{title}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">About {WEBSITE_NAME}</h1>

        <section>
          <p>
            {WEBSITE_NAME} was created to provide a better experience for anyone
            researching PC hardware. Our website&apos;s tools and comprehensive
            database of parts will help you make an informed choice of which
            part you should add to your PC build.
          </p>

          <p>
            We have an exciting roadmap with plans for more content and tools
            that will further help the PC community. If you have any feedback,
            questions, or requests, then please reach out to our emails listed
            below. We thank you for your support.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">For advertising inquiries</h2>
          <p>advertise@pcpartdb.com</p>
        </section>

        <section>
          <h2 className="font-semibold">For other inquiries</h2>
          <p>hello@pcpartdb.com</p>
        </section>

        <section>
          <h2 className="font-semibold">Affiliate Disclaimer</h2>
          <p>
            We are a participant of affiliate advertising programs which allow
            us to earn from qualifying purchases. We do not buy or sell the
            parts listed on this website.
          </p>
        </section>
      </article>
    </WebsiteLayout>
  );
};
