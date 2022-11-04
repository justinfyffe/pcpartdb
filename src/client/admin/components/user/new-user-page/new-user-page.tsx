import 'reflect-metadata';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import React from 'react';
import { UserForm } from '../user-form';

export interface NewUserPageProps {}

export const AdminNewUserPage = (_props: NewUserPageProps) => {
  return (
    <AdminLayout>
      <Article>
        <ArticleHeader>
          <h1>Users - New User</h1>

          <Button variant={ButtonVariant.Default} href="/admin/users">
            Back
          </Button>
        </ArticleHeader>

        <UserForm />
      </Article>
    </AdminLayout>
  );
};
