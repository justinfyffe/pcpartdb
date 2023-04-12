import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import { Table, TBody, Th, THead, Tr } from '../../../../../shared/components';
import { DataUpdatesPageContext } from '../../context';
import { UpdateRow } from './UpdateRow';

interface UpdatesTableProps {}

export const UpdatesTable: FunctionComponent<UpdatesTableProps> = (_props) => {
  const context = useContext(DataUpdatesPageContext);
  const { updates, setUpdates } = context;

  const handleUpdate = useCallback(
    (update: DataUpdate) => {
      const newUpdates = [...updates];
      const idx = newUpdates.findIndex((value) => update.id === value.id);
      if (idx >= 0) {
        newUpdates.splice(idx, 1);
      }
      setUpdates(newUpdates);
    },
    [setUpdates, updates],
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
          <UpdateRow
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
