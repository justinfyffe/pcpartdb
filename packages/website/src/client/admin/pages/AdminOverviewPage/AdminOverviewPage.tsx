import 'reflect-metadata';
import { AdminOverviewViewModel } from '@pcpartdb/shared';
import React from 'react';
import { Card, CardTitle } from '../../../shared/components/Card/Card';
import { MetaRobots, Seo } from '../../../shared/components/Seo/Seo';
import { AdminLayout } from '../../../shared/layouts/admin/AdminLayout';
import { ApiKeyWidget } from './components';
import { CacheWidget } from './components/CacheWidget/CacheWidget';
import { UpdateRanksWidget } from './components/UpdateRanksWidget/UpdateRanksWidget';
import { UpdateRelatedProductsWidget } from './components/UpdateRelatedProductsWidget/UpdateRelatedProductsWidget';

export const AdminOverviewPage = (props: AdminOverviewViewModel) => {
  const pageTitle = 'Overview';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <div className="flex flex-wrap gap-4">
          <Card className="flex-1">
            <CardTitle className="whitespace-nowrap">
              Scraping Ant Usage:
            </CardTitle>
            {props.scrapingAntUsage?.remainingCredits?.toLocaleString()} /{' '}
            {props.scrapingAntUsage?.totalCredits?.toLocaleString()}
          </Card>

          <UpdateRanksWidget />

          <UpdateRelatedProductsWidget />

          <CacheWidget cacheItems={props.cacheItems} />

          <ApiKeyWidget apiKey={props.apiKey} />
        </div>
      </article>
    </AdminLayout>
  );
};
