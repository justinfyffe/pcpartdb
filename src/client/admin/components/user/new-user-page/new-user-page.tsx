import 'reflect-metadata';
import { Button, ButtonVariant } from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';
import { UserForm } from '../user-form';

export interface NewUserPageProps {}

export const AdminNewUserPage = (_props: NewUserPageProps) => {
  return (
    <AdminLayout>
      <article>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Users - New User</h1>

          <Button variant={ButtonVariant.Default} href="/admin/users">
            Back
          </Button>
        </div>

        <UserForm />
      </article>
    </AdminLayout>
  );
};
