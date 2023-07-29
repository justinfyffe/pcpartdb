import 'reflect-metadata';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AutomationAction, AutomationQueueItem } from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation';
import {
  showDialog,
  Td,
  Tr,
} from 'packages/website/src/client/shared/components';
import { GenericButton } from 'packages/website/src/client/shared/components/Button/GenericButton';
import React, { useCallback, useMemo, useState } from 'react';
import { QueueDetailsDialog } from './QueueDetailsDialog';

interface QueueRowProps {
  item: AutomationQueueItem;
}

export const QueueRow = (props: QueueRowProps) => {
  const { item } = props;

  // States

  const [deleted, setDeleted] = useState(false);

  // Memos

  const action = useMemo(() => formatAction(item.action), [item.action]);

  // Callbacks

  const viewItemDetails = useCallback(() => {
    showDialog(<QueueDetailsDialog item={item} />);
  }, [item]);

  const deleteItem = useCallback(async () => {
    await automationService.deleteItem(item.id);
    setDeleted(true);
  }, [item.id]);

  // Render

  return (
    <Tr className={deleted ? 'line-through' : ''}>
      <Td>{item.id}</Td>
      <Td>{action}</Td>
      <Td>{item.description}</Td>
      <Td className="flex justify-end gap-2">
        <GenericButton onClick={viewItemDetails} disabled={deleted}>
          <InformationCircleIcon className="w-4" />
        </GenericButton>
        <GenericButton onClick={deleteItem} disabled={deleted}>
          <XMarkIcon className="w-4" />
        </GenericButton>
      </Td>
    </Tr>
  );
};

function formatAction(action: AutomationAction) {
  switch (action) {
    case AutomationAction.UpdateSitemaps:
      return 'Update Sitemap';
    case AutomationAction.UpdateCpuSources:
      return 'Update CPU Sources';
    case AutomationAction.UpdateGpuSources:
      return 'Update GPU Sources';
    case AutomationAction.CreateCpu:
      return 'Create CPU';
    case AutomationAction.UpdateCpu:
      return 'Update CPU';
    case AutomationAction.CreateGpu:
      return 'Create GPU';
    case AutomationAction.UpdateGpu:
      return 'Update GPU';
    default:
      return 'Unknown';
  }
}
