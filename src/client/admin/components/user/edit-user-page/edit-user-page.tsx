import 'reflect-metadata';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
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
      <Article>
        <ArticleHeader>
          <h1>Users - Edit User</h1>

          <Button href="/admin/users" variant={ButtonVariant.Default}>
            Back
          </Button>
        </ArticleHeader>

        <UserForm user={user} />
      </Article>
    </AdminLayout>
  );
};
