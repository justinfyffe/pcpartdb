import {
  DataUpdate,
  DataUpdateStatus,
  DEFAULT_LIST_DATA_UPDATES_LIMIT,
  DEFAULT_LIST_DATA_UPDATES_OFFSET,
} from '@pcpartdb/shared';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  AlertVariant,
  Pagination,
  PaginationResult,
} from '../../../../../shared/components';
import { adminService } from '../../../../adminService';
import { DataUpdatesPageContext } from '../../context';
import { useDataUpdatesPageContextProps } from '../../hooks';
import { UpdatesTable } from '../UpdatesTable';

interface UpdatesTabProps {
  status: DataUpdateStatus;
  updates?: DataUpdate[];
  totalUpdates?: number;
}

export const UpdatesTab: FunctionComponent<UpdatesTabProps> = (props) => {
  const [limit, setLimit] = useState(DEFAULT_LIST_DATA_UPDATES_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_LIST_DATA_UPDATES_OFFSET);

  const status = props.status;
  const [updates, setUpdates] = useState(props.updates || []);
  const [totalUpdates, setTotalUpdates] = useState(props.totalUpdates || 0);

  useEffect(() => {
    async function fetchUpdates() {
      const response = await adminService.getUpdates({
        status,
        limit,
        offset,
      });
      setUpdates(response.updates);
      setTotalUpdates(response.totalUpdates);
    }
    fetchUpdates();
  }, [status, limit, offset]);

  const paginationPageClick = useCallback(async (result: PaginationResult) => {
    setLimit(result.limit);
    setOffset(result.offset);
  }, []);

  const context = useDataUpdatesPageContextProps({
    status,
    updates: updates,
    setUpdates: setUpdates,
  });

  return (
    <DataUpdatesPageContext.Provider value={context}>
      <section>
        {updates.length > 0 && (
          <>
            <UpdatesTable />

            <Pagination
              resultsOffset={offset}
              resultsPerPage={limit}
              totalResults={totalUpdates}
              onPageClick={paginationPageClick}
              neighborPagesClassName="lg:hidden"
              hidePages={false}
            />
          </>
        )}

        {updates.length === 0 && (
          <Alert variant={AlertVariant.Info}>
            There are no {status?.toLowerCase()} updates.
          </Alert>
        )}
      </section>
    </DataUpdatesPageContext.Provider>
  );
};
