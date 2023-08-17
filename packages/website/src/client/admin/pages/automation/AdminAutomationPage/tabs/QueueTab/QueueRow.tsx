import 'reflect-metadata';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AutomationAction, AutomationActionType } from '@pcpartdb/shared';
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
  item: AutomationAction;
}

export const QueueRow = (props: QueueRowProps) => {
  const { item } = props;

  // States

  const [deleted, setDeleted] = useState(false);

  // Memos

  const action = useMemo(() => formatAction(item.type), [item.type]);

  // Callbacks

  const viewItemDetails = useCallback(() => {
    showDialog(<QueueDetailsDialog item={item} />);
  }, [item]);

  const deleteItem = useCallback(async () => {
    await automationService.cancelAction(item.id);
    setDeleted(true);
  }, [item.id]);

  // Render

  return (
    <Tr className={deleted ? 'line-through' : ''}>
      <Td>{item.id}</Td>
      <Td>{action}</Td>
      <Td>{item.description}</Td>
      <Td className="flex justify-end gap-4 flex-wrap">
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

function formatAction(action: AutomationActionType) {
  switch (action) {
    case AutomationActionType.UpdateSitemaps:
      return 'Update Sitemap';
    case AutomationActionType.UpdateCpuSources:
      return 'Update CPU Sources';
    case AutomationActionType.UpdateGpuChipsetSources:
      return 'Update GPU Chipset Sources';
    case AutomationActionType.UpdateGpuRetailModelSources:
      return 'Update GPU Retail Model Sources';
    case AutomationActionType.CreateCpu:
      return 'Create CPU';
    case AutomationActionType.UpdateCpu:
      return 'Update CPU';
    case AutomationActionType.CreateGpu:
      return 'Create GPU';
    case AutomationActionType.UpdateGpu:
      return 'Update GPU';
    default:
      return 'Unknown';
  }
}
