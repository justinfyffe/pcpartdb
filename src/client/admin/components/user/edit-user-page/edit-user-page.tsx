import 'reflect-metadata';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { User } from '@shared/user';
import React from 'react';
import { UserForm } from '../user-form';

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
