import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../client/auth/with-staff-guard';
import {
  Article,
  ArticleHeader,
} from '../../../client/shared/components/article';
import {
  Button,
  ButtonVariant,
} from '../../../client/shared/components/button';
import { AdminLayout } from '../../../client/shared/layouts/admin';
import { UserForm } from '../../../client/user/components/user-form';

export interface NewUserPageProps {}

const AdminNewUserPage = (_props: NewUserPageProps) => {
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

export default withStaffGuard(AdminNewUserPage);
