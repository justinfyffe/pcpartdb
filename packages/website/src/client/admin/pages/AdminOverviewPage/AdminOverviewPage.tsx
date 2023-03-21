import 'reflect-metadata';
import React from 'react';
import { MetaRobots, Seo } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

interface AdminOverviewPageProps {}

export const AdminOverviewPage = (_props: AdminOverviewPageProps) => {
  const pageTitle = 'Overview';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>
      </article>
    </AdminLayout>
  );
};
