import 'reflect-metadata';
import { AdminEditUserViewModel } from '@pcpartdb/shared';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import {
  MetaRobots,
  Seo,
} from 'packages/website/src/client/shared/components/Seo/Seo';
import React from 'react';
import { AdminLayout } from '../../../../shared/layouts';
import { UserForm } from '../../../components';

export const AdminEditUserPage = (props: AdminEditUserViewModel) => {
  const { user } = props;

  const pageTitle = 'Edit User';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <GenericButton href="/admin/users">Back</GenericButton>
        </div>

        <UserForm user={user} />
      </article>
    </AdminLayout>
  );
};
