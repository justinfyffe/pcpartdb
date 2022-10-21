import 'reflect-metadata';
import { withStaffGuard } from '@client/auth';
import {
  Article,
  ArticleHeader,
  Button,
  ButtonVariant,
} from '@client/shared/components';
import { AdminLayout } from '@client/shared/layouts';
import { userService } from '@client/user';
import { User } from '@shared/user';
import { NextPageContext } from 'next';
import React from 'react';
import { UserForm } from '../user-form';

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
