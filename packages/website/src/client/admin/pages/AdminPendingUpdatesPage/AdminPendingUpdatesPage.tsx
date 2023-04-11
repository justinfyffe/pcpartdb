import 'reflect-metadata';
import {
  AdminPendingUpdatesViewModel,
  DEFAULT_LIST_UPDATES_LIMIT,
  DEFAULT_LIST_UPDATES_OFFSET,
} from '@pcpartdb/shared';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AlertVariant,
  MetaRobots,
  Pagination,
  PaginationResult,
  Seo,
} from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { adminService } from '../../adminService';
import { PendingUpdatesTable } from './components';

export const AdminPendingUpdatesPage = (
  props: AdminPendingUpdatesViewModel,
) => {
  const [limit, setLimit] = useState(DEFAULT_LIST_UPDATES_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_LIST_UPDATES_OFFSET);

  const pageTitle = 'Pending Updates';
  const seoTitle = `${pageTitle} - Admin Panel`;
  const seoRobots = [MetaRobots.NOINDEX, MetaRobots.NOFOLLOW];

  const [pendingUpdates, setPendingUpdates] = useState(props.pendingUpdates);
  const [totalResults, setTotalResults] = useState(props.totalResults);

  useEffect(() => {
    async function fetchPendingUpdates() {
      const { pendingUpdates, totalPendingUpdates } =
        await adminService.getPendingUpdates({ limit, offset });
      setPendingUpdates(pendingUpdates);
      setTotalResults(totalPendingUpdates);
    }
    fetchPendingUpdates();
  }, [limit, offset]);

  const paginationPageClick = useCallback(
    async (result: PaginationResult, evt: React.MouseEvent) => {
      evt.preventDefault();
      evt.stopPropagation();
      setLimit(result.limit);
      setOffset(result.offset);
    },
    [],
  );

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <article>
        <h1 className="font-semibold mb-4">{pageTitle}</h1>

        <section>
          {pendingUpdates.length > 0 && (
            <>
              <PendingUpdatesTable updates={pendingUpdates} />

              <Pagination
                resultsOffset={offset}
                resultsPerPage={limit}
                totalResults={totalResults}
                onPageClick={paginationPageClick}
                neighborPagesClassName="lg:hidden"
                hidePages={false}
              />
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
