import 'reflect-metadata';
import { getAdminNewGamePath, getAdminScrapeGamesPath } from '@pcpartdb/shared';
import { useRouter } from 'next/router';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useState } from 'react';
import { GamesList } from './components/GamesList/GamesList';
import { ListFilters } from './components/ListFilters/ListFilters';
import {
  AdminListGamesContext,
  useAdminListGamesContextBuilder,
} from './context/AdminListGamesContext';

export const AdminListGamesPage = () => {
  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const pageTitle = 'Games';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const context = useAdminListGamesContextBuilder();

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <AdminListGamesContext.Provider value={context}>
        <article>
          <section>
            {saved && <SuccessAlert>The game has been saved.</SuccessAlert>}

            {deleted && <SuccessAlert>The game has been deleted.</SuccessAlert>}
          </section>

          <div className="flex items-center justify-between mb-4">
            <h1 className="font-semibold">{pageTitle}</h1>

            <div className="flex gap-4">
              <GenericButton href={getAdminScrapeGamesPath()}>
                Scrape
              </GenericButton>
              <GenericButton href={getAdminNewGamePath()}>Add</GenericButton>
            </div>
          </div>

          <section>
            <ListFilters />
            {context.totalGames > 0 ? (
              <>
                <div className="text-right">
                  Total Results: {context.totalGames}
                </div>
                <GamesList />
              </>
            ) : (
              <>
                <InfoAlert>There are no games for these filters.</InfoAlert>
              </>
            )}
          </section>
        </article>
      </AdminListGamesContext.Provider>
    </AdminLayout>
  );
};
