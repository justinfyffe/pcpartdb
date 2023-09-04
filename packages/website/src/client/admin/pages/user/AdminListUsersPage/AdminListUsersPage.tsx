import 'reflect-metadata';
import {
  AdminListUsersViewModel,
  getAdminEditUserPath,
  getAdminNewUserPath,
} from '@pcpartdb/shared';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { SuccessAlert } from 'packages/website/src/client/shared/components/Alert/SuccessAlert';
import React, { useState } from 'react';
import {
  Button,
  ButtonVariant,
  MetaRobots,
  Seo,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../../shared/components';
import { AdminLayout } from '../../../../shared/layouts';

export const AdminListUsersPage = (props: AdminListUsersViewModel) => {
  const { users } = props;

  const router = useRouter();
  const [saved] = useState(router.query.saved === 'true');
  const [deleted] = useState(router.query.deleted === 'true');

  const pageTitle = 'Users';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <section>
          {saved && <SuccessAlert>The user has been saved.</SuccessAlert>}

          {deleted && <SuccessAlert>The user has been deleted.</SuccessAlert>}
        </section>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold">{pageTitle}</h1>

          <Button variant={ButtonVariant.Primary} href={getAdminNewUserPath()}>
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
                      <a href={getAdminEditUserPath(user)}>{user.email}</a>
                    </Td>
                    <Td className="text-center">
                      {format(user.registeredAt, "MMMM d, yyyy 'at' h:mm a")}
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          )}

          {users.length === 0 && <InfoAlert>There are no users.</InfoAlert>}
        </section>
      </article>
    </AdminLayout>
  );
};
