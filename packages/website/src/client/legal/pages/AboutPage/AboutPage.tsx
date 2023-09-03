import 'reflect-metadata';
import { getAboutPath, getHomePath, WEBSITE_NAME } from '@pcpartdb/shared';
import React, { useMemo } from 'react';
import { Breadcrumb, Breadcrumbs, Seo } from '../../../shared/components';
import { WebsiteLayout } from '../../../shared/layouts';

interface AboutPageProps {}

export const AboutPage = (_props: AboutPageProps) => {
  const pageTitle = `About ${WEBSITE_NAME}`;
  const seoTitle = 'About Us';
  const seoDescription =
    'Mission statement and contact details for PC Part DB.';
  const seoCanonical = useMemo(() => getAboutPath(), []);
  const seoKeywords: string[] = [];

  const homeHref = useMemo(() => getHomePath(), []);

  return (
    <WebsiteLayout>
      <Seo
        title={seoTitle}
        keywords={seoKeywords}
        description={seoDescription}
        canonical={seoCanonical}
      />

      <Breadcrumbs className="mb-4">
        <Breadcrumb href={homeHref}>Home</Breadcrumb>
        <Breadcrumb>{pageTitle}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

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
          <h2 className="font-semibold">Affilliate Disclaimer</h2>
          <p>
            {WEBSITE_NAME} is a participant in the Amazon Services LLC
            Associates Program, an affiliate advertising program. We earn from
            qualifying purchases made through Amazon.com.
          </p>
        </section>

        {/* <section>
          <h2 className="font-semibold">Affiliate Disclaimer</h2>
          <p>
            We are a participant of affiliate advertising programs which allow
            us to earn from qualifying purchases. We do not buy or sell the
            parts listed on this website.
          </p>
        </section> */}
      </article>
    </WebsiteLayout>
  );
};
