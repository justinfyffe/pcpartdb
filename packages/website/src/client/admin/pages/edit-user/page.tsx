import 'reflect-metadata';
import { AdminEditUserViewModel } from '@pcpartdb/shared/view-models';
import React from 'react';
import { UserForm } from '../../../admin/components';
import { Button, ButtonVariant } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

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
