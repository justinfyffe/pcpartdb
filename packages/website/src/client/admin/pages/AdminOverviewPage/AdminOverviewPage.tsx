import 'reflect-metadata';
import { AdminOverviewViewModel } from '@pcpartdb/shared';
import React from 'react';
import { Card, CardTitle } from '../../../shared/components';
import { MetaRobots, Seo } from '../../../shared/components/Seo/Seo';
import { AdminLayout } from '../../../shared/layouts';
import { ApiKeyWidget } from './components';

export const AdminOverviewPage = (props: AdminOverviewViewModel) => {
  const pageTitle = 'Overview';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <div className="grid grid-flow-col gap-4">
          <Card>
            <CardTitle>Scraping Ant Usage:</CardTitle>
            {props.scrapingAntUsage?.remainingCredits} /{' '}
            {props.scrapingAntUsage?.totalCredits}
          </Card>

          <ApiKeyWidget apiKey={props.apiKey} />
        </div>
      </article>
    </AdminLayout>
  );
};
