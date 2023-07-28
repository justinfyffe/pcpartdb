import 'reflect-metadata';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AutomationQueueItem } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
  Td,
  Tr,
} from 'packages/website/src/client/shared/components';
import React from 'react';

interface QueueRowProps {
  item: AutomationQueueItem;
}

export const QueueRow = (props: QueueRowProps) => {
  const { item } = props;

  return (
    <Tr>
      <Td>{item.id}</Td>
      <Td>New CPU</Td>
      <Td>Intel i7-12345k</Td>
      <Td className="flex justify-end gap-2">
        <Button variant={ButtonVariant.Generic}>
          <InformationCircleIcon className="w-4" />
        </Button>
        <Button variant={ButtonVariant.Generic}>
          <XMarkIcon className="w-4" />
        </Button>
      </Td>
    </Tr>
  );
};
