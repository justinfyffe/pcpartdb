import 'reflect-metadata';
import {
  AdminEditGameViewModel,
  getAdminListGamesPath,
} from '@pcpartdb/shared';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import { AdminLayout } from 'packages/website/src/client/shared/layouts/admin/AdminLayout';
import React, { useMemo } from 'react';
import { GameForm } from '../../../components/game/GameForm/GameForm';

export const AdminEditGamePage = (props: AdminEditGameViewModel) => {
  const { game } = props;
  const { adminListHref } = useMemo(() => {
    const adminListHref = getAdminListGamesPath();
    return { adminListHref };
  }, []);

  const pageTitle = 'Edit Game';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <GenericButton href={adminListHref}>Back</GenericButton>
        </div>

        <GameForm game={game} redirectAfterSave />
      </article>
    </AdminLayout>
  );
};
