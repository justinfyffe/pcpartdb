import 'reflect-metadata';
import React from 'react';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';
import { UserForm } from '../../../web/user/components/user-form';

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
