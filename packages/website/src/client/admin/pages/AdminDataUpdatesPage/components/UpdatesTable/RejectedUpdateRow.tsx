import { NoSymbolIcon } from '@heroicons/react/24/outline';
import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback } from 'react';
import { Button, showDialog, Td, Tr } from '../../../../../shared/components';
import { PreviewDialog } from '../PreviewDialog';

interface RejectedUpdateRowProps {
  update: DataUpdate;
}

export const RejectedUpdateRow: FunctionComponent<RejectedUpdateRowProps> = (
  props,
) => {
  const { update } = props;

  const handlePreviewUpdate = useCallback((update: DataUpdate) => {
    showDialog(<PreviewDialog dataUpdate={update} />);
  }, []);

  return (
    <Tr>
      <Td className="text-left">{update.id}</Td>
      <Td>
        <a
          className="cursor-pointer"
          onClick={() => handlePreviewUpdate(update)}
        >
          {update.description}
        </a>
      </Td>
      <Td className="flex gap-4 justify-end">
        <Button disabled>
          <NoSymbolIcon className="w-4" />
        </Button>
      </Td>
    </Tr>
  );
};
