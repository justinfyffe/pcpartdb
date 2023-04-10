import 'reflect-metadata';
import { CheckIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { AdminPendingUpdatesViewModel, DataUpdate } from '@pcpartdb/shared';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  MetaRobots,
  Pagination,
  PaginationResult,
  Seo,
  showDialog,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { PreviewDialog } from './components';

export const AdminPendingUpdatesPage = (
  props: AdminPendingUpdatesViewModel,
) => {
  const pageTitle = 'Pending Updates';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const [pendingUpdates, setPendingUpdates] = useState(props.pendingUpdates);
  const [totalResults, setTotalResults] = useState(props.totalResults);

  const handlePreviewUpdate = useCallback((update: DataUpdate) => {
    showDialog(<PreviewDialog dataUpdate={update} />);
  }, []);

  // const paginationPageClick = useCallback(
  //   (result: PaginationResult, evt: React.MouseEvent) => {
  //     evt.preventDefault();
  //     evt.stopPropagation();
  //   },
  //   [],
  // );

  // const paginationHrefBuilder = useCallback(
  //   (result: PaginationResult) =>
  //     getAdminListGpusPath({
  //       ...query,
  //       offset: result.offset,
  //       limit: result.limit,
  //     }),
  //   [query],
  // );

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <section>
          {pendingUpdates.length > 0 && (
            <>
              <Table border responsive>
                <THead>
                  <Tr className="font-medium">
                    <Th className="text-left">ID</Th>
                    <Th>Description</Th>
                    <Th></Th>
                  </Tr>
                </THead>
                <TBody>
                  {pendingUpdates.map((pendingUpdate) => (
                    <Tr key={pendingUpdate.id}>
                      <Td className="text-left">{pendingUpdate.id}</Td>
                      <Td>
                        <a
                          className="cursor-pointer"
                          onClick={() => handlePreviewUpdate(pendingUpdate)}
                        >
                          {pendingUpdate.description}
                        </a>
                      </Td>
                      <Td className="flex gap-4 justify-end">
                        <Button variant={ButtonVariant.Default}>
                          <CheckIcon className="w-4" />
                        </Button>

                        <Button variant={ButtonVariant.Default}>
                          <NoSymbolIcon className="w-4" />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>

              {/* <Pagination
                resultsOffset={query.offset}
                resultsPerPage={query.limit}
                totalResults={totalResults}
                onPageClick={paginationPageClick}
                hrefBuilder={paginationHrefBuilder}
                neighborPagesClassName="lg:hidden"
                hidePages={false}
              /> */}
            </>
          )}

          {pendingUpdates.length === 0 && (
            <Alert variant={AlertVariant.Info}>
              There are no pending updates.
            </Alert>
          )}
        </section>
      </article>
    </AdminLayout>
  );
};
