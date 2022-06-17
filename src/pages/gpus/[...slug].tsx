import { NextPageContext } from 'next';
import React from 'react';
import { WebsiteLayout } from '../../web/shared/layouts/website';
import { classNames } from '../../web/shared/ui/ui.utils';

interface GpuSlugPageProps {}

const GpuSlugPage = (_props: GpuSlugPageProps) => {
  return (
    <WebsiteLayout>
      <main></main>
    </WebsiteLayout>
  );
};

GpuSlugPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default GpuSlugPage;
