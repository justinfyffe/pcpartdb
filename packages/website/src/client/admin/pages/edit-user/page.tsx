import 'reflect-metadata';
import { AdminEditUserViewModel } from '@pcpartdb/shared/view-models';
import { UserForm } from '@pcpartdb/website/client/admin/components';
import {
  Button,
  ButtonVariant,
} from '@pcpartdb/website/client/shared/components';
import { AdminLayout } from '@pcpartdb/website/client/shared/layouts';
import React from 'react';

export const AdminEditUserPage = (props: AdminEditUserViewModel) => {
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
