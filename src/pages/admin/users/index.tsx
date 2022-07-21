import 'reflect-metadata';
import { format } from 'date-fns';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { User } from '../../../types/user';
import { withStaffGuard } from '../../../web/auth/with-staff-guard';
import { Alert, AlertVariant } from '../../../web/shared/components/alert';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import {
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../web/shared/components/table';
import { AdminLayout } from '../../../web/shared/layouts/admin';
import { userService } from '../../../web/user/user.service';

interface AdminUsersPageProps {
  users: User[];
}

const AdminUsersPage = (props: AdminUsersPageProps) => {
  const { users } = props;

  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  return (
    <AdminLayout>
      <article className="w-full">
        {saved && (
          <Alert variant={AlertVariant.Success}>The user has been saved.</Alert>
        )}

        {deleted && (
          <Alert variant={AlertVariant.Success}>
            The user has been deleted.
          </Alert>
        )}

        <header className="flex justify-between">
          <h1>Users</h1>

          <Button variant={ButtonVariant.Primary} href="/admin/users/new">
            Add
          </Button>
        </header>

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
      </article>
    </AdminLayout>
  );
};

AdminUsersPage.getInitialProps = async (_ctx: NextPageContext) => {
  const usersList = await userService.list();
  return { users: usersList || [] };
};

export default withStaffGuard(AdminUsersPage);
