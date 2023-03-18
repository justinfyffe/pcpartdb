import 'reflect-metadata';
import { getAdminListUsersPath } from '@pcpartdb/shared';
import React from 'react';
import { UserForm } from '../../../admin/components';
import { Button, ButtonVariant } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export interface NewUserPageProps {}

export const AdminNewUserPage = (_props: NewUserPageProps) => {
  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Users - New User</h1>

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
