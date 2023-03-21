import 'reflect-metadata';
import { getAdminListUsersPath } from '@pcpartdb/shared';
import React from 'react';
import { UserForm } from '../../../admin/components';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export interface NewUserPageProps {}

export const AdminNewUserPage = (_props: NewUserPageProps) => {
  const pageTitle = 'New User';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button
            variant={ButtonVariant.Default}
            href={getAdminListUsersPath()}
          >
            Back
          </Button>
        </div>

        <UserForm />
      </article>
    </AdminLayout>
  );
};
