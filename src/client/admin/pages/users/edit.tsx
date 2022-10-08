import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { User } from '../../../../shared/user';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import { AdminLayout } from '../../../shared/layouts/admin';
import { UserForm } from '../../../user/components/user-form';
import { userService } from '../../../user/user.service';

export interface EditUserPageProps {
  user: User;
}

const EditUserPage = (props: EditUserPageProps) => {
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

EditUserPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { userId: string };
  const userId = parseInt(query.userId, 10);

  return {
    user: await userService.get(userId),
  };
};

export const AdminEditUserPage = withStaffGuard(EditUserPage);
