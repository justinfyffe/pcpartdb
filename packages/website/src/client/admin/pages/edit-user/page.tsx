import 'reflect-metadata';
import { UserForm } from '@pcpartdb/website/client/admin/components';
import {
  Button,
  ButtonVariant,
} from '@pcpartdb/website/client/shared/components';
import { AdminLayout } from '@pcpartdb/website/client/shared/layouts';
import { User } from '@pcpartdb/website/shared/user';
import React from 'react';

export interface AdminEditUserPageProps {
  user: User;
}

export const AdminEditUserPage = (props: AdminEditUserPageProps) => {
  const { user } = props;

  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Users - Edit User</h1>

          <Button href="/admin/users" variant={ButtonVariant.Default}>
            Back
          </Button>
        </div>

        <UserForm user={user} />
      </article>
    </AdminLayout>
  );
};
