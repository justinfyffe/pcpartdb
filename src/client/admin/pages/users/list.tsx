import 'reflect-metadata';
import { format } from 'date-fns';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { User } from '../../../../shared/user';
import { withStaffGuard } from '../../../auth/with-staff-guard';
import { Alert, AlertVariant } from '../../../shared/components/alert';
import { Article, ArticleHeader } from '../../../shared/components/article';
import { Button, ButtonVariant } from '../../../shared/components/button';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../shared/components/table';
import { AdminLayout } from '../../../shared/layouts/admin';
import { userService } from '../../../user/user.service';

interface ListUsersPageProps {
  users: User[];
}

const ListUsersPage = (props: ListUsersPageProps) => {
  const { users } = props;

  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  return (
    <AdminLayout>
      <Article>
        {saved && (
          <Alert variant={AlertVariant.Success}>The user has been saved.</Alert>
        )}

        {deleted && (
          <Alert variant={AlertVariant.Success}>
            The user has been deleted.
          </Alert>
        )}

        <ArticleHeader>
          <h1>Users</h1>

          <Button variant={ButtonVariant.Primary} href="/admin/users/new">
            Add
          </Button>
        </ArticleHeader>

        {users.length > 0 && (
          <Table border responsive>
            <THead>
              <Tr className="font-medium">
                <Th className="text-center">ID</Th>
                <Th>Email</Th>
                <Th className="text-center">Date Registered</Th>
              </Tr>
            </THead>
            <TBody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td className="text-center">{user.id}</Td>
                  <Td>
                    <a href={`/admin/users/${user.id}`}>{user.email}</a>
                  </Td>
                  <Td className="text-center">
                    {format(user.registeredAt, "MMMM d, yyyy 'at' h:mm a")}
                  </Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}

        {users.length === 0 && (
          <Alert variant={AlertVariant.Info}>There are no users.</Alert>
        )}
      </Article>
    </AdminLayout>
  );
};

ListUsersPage.getInitialProps = async (_ctx: NextPageContext) => {
  const usersList = await userService.list();
  return { users: usersList || [] };
};

export const AdminListUsersPage = withStaffGuard(ListUsersPage);
