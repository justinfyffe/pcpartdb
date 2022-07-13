import { NextPageContext } from 'next';
import React from 'react';
import { WebsiteLayout } from '../../web/shared/layouts/website';

interface GpusSlugPageProps {}

const GpusSlugPage = (_props: GpusSlugPageProps) => {
  return (
    <WebsiteLayout>
      <main></main>
    </WebsiteLayout>
  );
};

GpusSlugPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default GpusSlugPage;
