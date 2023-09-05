import 'reflect-metadata';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { AutomationAction, ListAutomationActionsQuery } from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation';
import { InfoAlert } from 'packages/website/src/client/shared/components/Alert/InfoAlert';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import { Pagination } from 'packages/website/src/client/shared/components/Pagination/Pagination';
import {
  Table,
  TBody,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components/Table/Table';
import React, { useCallback, useEffect, useState } from 'react';
import { QueueRow } from './QueueRow';

const LIMIT = 50;

interface QueueTabProps {}

export const QueueTab = (_props: QueueTabProps) => {
  // States

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AutomationAction[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState<ListAutomationActionsQuery>({
    pagination: { offset: 0, limit: LIMIT },
  });

  // Callbacks

  const fetchPendingItems = useCallback(
    async (q: ListAutomationActionsQuery) => {
      setLoading(true);
      setQuery(q);
      const response = await automationService.listPending({ query: q });
      setQuery(response.query);
      setItems(response.results);
      setTotal(response.total);
      setLoading(false);
    },
    [],
  );

  const refresh = useCallback(() => {
    fetchPendingItems({ ...query });
  }, [fetchPendingItems, query]);

  const changePage = useCallback(
    (offset: number, limit: number) => {
      const pagination = { offset, limit };
      fetchPendingItems({ ...query, pagination });
    },
    [fetchPendingItems, query],
  );

  // Effects

  useEffect(() => {
    fetchPendingItems(query);
    // Only run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-end">
        {total > 0 && (
          <Pagination
            displayTotal={true}
            offset={query.pagination.offset}
            limit={query.pagination.limit}
            total={total}
            onChange={changePage}
          ></Pagination>
        )}

        <GenericButton onClick={refresh}>
          <ArrowPathIcon className="w-4" />
        </GenericButton>
      </div>

      {loading && total === 0 && (
        <InfoAlert>Fetching pending queue items. Please wait.</InfoAlert>
      )}

      {!loading && total === 0 && (
        <InfoAlert>No pending queue items. Try refreshing.</InfoAlert>
      )}

      {total > 0 && (
        <>
          <Table>
            <THead>
              <Tr>
                <Th>ID</Th>
                <Th>Type</Th>
                <Th>Entry</Th>
                <Th></Th>
              </Tr>
            </THead>
            <TBody>
              {items.map((item) => (
                <QueueRow key={item.id} item={item} />
              ))}
            </TBody>
          </Table>
        </>
      )}
    </div>
  );
};
