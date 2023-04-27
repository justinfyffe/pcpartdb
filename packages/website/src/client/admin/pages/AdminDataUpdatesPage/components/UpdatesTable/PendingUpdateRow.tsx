import { CheckIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useCallback, useState } from 'react';
import {
  Button,
  ButtonVariant,
  showDialog,
  Spinner,
  Td,
  Tr,
} from '../../../../../shared/components';
import { adminService } from '../../../../adminService';
import { PreviewDialog } from '../PreviewDialog';

interface PendingUpdateRowProps {
  update: DataUpdate;
  onApprove?: (update: DataUpdate) => void;
  onReject?: (update: DataUpdate) => void;
}

export const PendingUpdateRow: FunctionComponent<PendingUpdateRowProps> = (
  props,
) => {
  const { update, onApprove, onReject } = props;
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleApproveClick = useCallback(
    async (update: DataUpdate) => {
      setApproving(true);
      await adminService.approvePendingUpdate(update.id);
      onApprove?.(update);
      setApproving(false);
    },
    [onApprove],
  );

  const handleRejectClick = useCallback(
    async (update: DataUpdate) => {
      setRejecting(true);
      adminService.rejectPendingUpdate(update.id);
      onReject?.(update);
      setRejecting(false);
    },
    [onReject],
  );

  const handlePreviewUpdate = useCallback((update: DataUpdate) => {
    showDialog(<PreviewDialog id={update.id} />);
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
        <Button
          variant={ButtonVariant.Default}
          disabled={approving || rejecting}
          onClick={() => handleApproveClick(update)}
        >
          {approving ? (
            <Spinner className="w-4" />
          ) : (
            <CheckIcon className="w-4" />
          )}
        </Button>

        <Button
          variant={ButtonVariant.Default}
          disabled={approving || rejecting}
          onClick={() => handleRejectClick(update)}
        >
          {rejecting ? (
            <Spinner className="w-4" />
          ) : (
            <NoSymbolIcon className="w-4" />
          )}
        </Button>
      </Td>
    </Tr>
  );
};
