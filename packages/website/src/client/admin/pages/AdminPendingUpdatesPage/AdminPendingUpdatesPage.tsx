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
import { PendingUpdatesPageContext } from './context';
import { usePendingUpdatesPageContextProps } from './hooks';

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
      const response = await adminService.getPendingUpdates({ limit, offset });
      setPendingUpdates(response.pendingUpdates);
      setTotalResults(response.totalPendingUpdates);
    }
    fetchPendingUpdates();
  }, [limit, offset]);

  const paginationPageClick = useCallback(async (result: PaginationResult) => {
    setLimit(result.limit);
    setOffset(result.offset);
  }, []);

  const context = usePendingUpdatesPageContextProps({
    pendingUpdates,
    setPendingUpdates,
  });

  return (
    <AdminLayout>
      <Seo title={seoTitle} robots={seoRobots} />

      <PendingUpdatesPageContext.Provider value={context}>
        <article>
          <h1 className="font-semibold mb-4">{pageTitle}</h1>

          <section>
            {pendingUpdates.length > 0 && (
              <>
                <PendingUpdatesTable />

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
      </PendingUpdatesPageContext.Provider>
    </AdminLayout>
  );
};
