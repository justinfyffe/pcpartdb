import 'reflect-metadata';
import { NextPageContext } from 'next';
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
import { userService } from '../../../client/user/user.service';
import { User } from '../../../shared/user';

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
