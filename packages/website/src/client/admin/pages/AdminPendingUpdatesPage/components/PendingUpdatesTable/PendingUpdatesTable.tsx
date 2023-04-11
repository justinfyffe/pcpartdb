import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { PendingUpdatesPageContext } from '../../context';
import { PendingUpdateRow } from './PendingUpdateRow';

interface PendingUpdatesTableProps {}

export const PendingUpdatesTable: FunctionComponent<
  PendingUpdatesTableProps
> = (_props) => {
  const context = useContext(PendingUpdatesPageContext);
  const { pendingUpdates, setPendingUpdates } = context;

  const handleUpdate = useCallback(
    (update: DataUpdate) => {
      const newUpdates = [...pendingUpdates];
      const idx = newUpdates.findIndex((value) => update.id === value.id);
      if (idx >= 0) {
        newUpdates.splice(idx, 1);
      }
      setPendingUpdates(newUpdates);
    },
    [setPendingUpdates, pendingUpdates],
  );

  return (
    <Table border responsive>
      <THead>
        <Tr className="font-medium">
          <Th className="text-left">ID</Th>
          <Th>Description</Th>
          <Th></Th>
        </Tr>
      </THead>
      <TBody>
        {pendingUpdates.map((update) => (
          <PendingUpdateRow
            key={update.id}
            update={update}
            onApprove={handleUpdate}
            onReject={handleUpdate}
          />
        ))}
      </TBody>
    </Table>
  );
};
