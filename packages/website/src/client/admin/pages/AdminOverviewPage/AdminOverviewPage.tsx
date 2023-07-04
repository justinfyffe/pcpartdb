import 'reflect-metadata';
import { AdminOverviewViewModel } from '@pcpartdb/shared';
import React from 'react';
import { Card, CardTitle, MetaRobots, Seo } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export const AdminOverviewPage = (props: AdminOverviewViewModel) => {
  const pageTitle = 'Overview';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <Card className="max-w-[300px]">
          <CardTitle>Scraping Ant Usage:</CardTitle>
          {props.scrapingAntUsage?.remainingCredits} /{' '}
          {props.scrapingAntUsage?.totalCredits}
        </Card>
      </article>
    </AdminLayout>
  );
};
