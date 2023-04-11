import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { PendingUpdateRow } from './PendingUpdateRow';

interface PendingUpdatesTableProps {
  updates: DataUpdate[];
  onUpdate?: (update: DataUpdate) => void;
}

export const PendingUpdatesTable: FunctionComponent<
  PendingUpdatesTableProps
> = (props) => {
  const [updates, setUpdates] = useState(props.updates);

  const handleUpdate = useCallback(
    (update: DataUpdate) => {
      const newUpdates = [...updates];
      const idx = updates.findIndex((value) => update.id === value.id);
      if (idx >= 0) {
        newUpdates.splice(idx, 1);
      }
      setUpdates(newUpdates);
    },
    [updates],
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
        {updates.map((update) => (
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
