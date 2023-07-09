import 'reflect-metadata';
import { AdminEditUserViewModel } from '@pcpartdb/shared';
import React from 'react';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../../shared/components';
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

          <Button href="/admin/users" variant={ButtonVariant.Generic}>
            Back
          </Button>
        </div>

        <UserForm user={user} />
      </article>
    </AdminLayout>
  );
};
