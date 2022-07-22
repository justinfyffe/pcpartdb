import 'reflect-metadata';
import { NextPageContext } from 'next';
import React from 'react';
import { User } from '../../../types/user';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Article, ArticleHeader } from '../../../web/shared/components/article';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { AdminLayout } from '../../../web/shared/layouts/admin';
import { UserForm } from '../../../web/user/components/user-form';
import { userService } from '../../../web/user/user.service';

export interface EditUserPageProps {
  user: User;
}

const AdminEditUserPage = (props: EditUserPageProps) => {
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

AdminEditUserPage.getInitialProps = async (ctx: NextPageContext) => {
  const query = ctx.query as { userId: string };
  const userId = parseInt(query.userId, 10);

  return {
    user: await userService.get(userId),
  };
};

export default withStaffGuard(AdminEditUserPage);
