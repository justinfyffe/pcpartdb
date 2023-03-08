import 'reflect-metadata';
import { AdminListUsersViewModel } from '@pcpartdb/shared';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';

export const AdminListUsersPage = (props: AdminListUsersViewModel) => {
  const { users } = props;

  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  return (
    <AdminLayout>
      <article>
        <section>
          {saved && (
            <Alert variant={AlertVariant.Success}>
              The user has been saved.
            </Alert>
          )}

          {deleted && (
            <Alert variant={AlertVariant.Success}>
              The user has been deleted.
            </Alert>
          )}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">Users</h1>

          <Button variant={ButtonVariant.Primary} href="/admin/users/new">
            Add
          </Button>
        </div>

        <section>
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
        </section>
      </article>
    </AdminLayout>
  );
};
