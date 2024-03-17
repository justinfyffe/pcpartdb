import { getAboutPath, getHomePath, WEBSITE_NAME } from '@pcpartdb/shared';
import { Metadata } from 'next';
import React from 'react';
import { Breadcrumb } from '../../_common/components/Breadcrumbs/Breadcrumb';
import { Breadcrumbs } from '../../_common/components/Breadcrumbs/Breadcrumbs';

const TITLE = 'About Us';

export const metadata: Metadata = {
  title: `${TITLE} - ${WEBSITE_NAME}`,
  description: 'Mission statement and contact details for PC Part DB.',
  alternates: {
    canonical: getAboutPath(),
  },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs className="mb-4">
        <Breadcrumb href={getHomePath()}>Home</Breadcrumb>
        <Breadcrumb>{TITLE}</Breadcrumb>
      </Breadcrumbs>

      <article>
        <h1 className="font-semibold mb-4">{TITLE}</h1>

        <section>
          <p>
            {WEBSITE_NAME} was created to deliver a better experience for
            researching and comparing PC hardware. Our goal is to provide a
            easy-to-use, comprehensive database of PC parts that will help you
            make an informed choice of which part you should add to your PC
            build.
          </p>

          <p>
            We aim to provide accurate technical specs, benchmark scores, and
            FPS measurements. To ensure comprehensiveness, we may supplement the
            content with data from:
          </p>
          <ul className="list-disc ml-8 -mt-3 mb-4">
            <li>Technical specs from the manufacturer.</li>
            <li>
              Benchmarks and FPS measurements from authoritative sources like{' '}
              <a href="https://www.notebookcheck.net/">Notebookcheck</a>.
            </li>
            <li>
              Benchmarks generated from software like Cinebench, Geekbench, and
              PassMark.
            </li>
            <li>
              User-submitted benchmark and FPS measurements. Please{' '}
              <a href="mailto:hello@pcpartdb.com">contact us</a> if you want to
              submit your measurements.
            </li>
          </ul>

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
      </article>
    </>
  );
}
