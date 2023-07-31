import 'reflect-metadata';
import { AutomationAction } from '@pcpartdb/shared';
import { Dialog } from 'packages/website/src/client/shared/components/Dialog/Dialog';
import React, { useMemo } from 'react';

interface QueueDetailsDialogProps {
  item: AutomationAction;
}

export const QueueDetailsDialog = (props: QueueDetailsDialogProps) => {
  const { item } = props;

  // Memos

  const data = useMemo(() => JSON.stringify(item.data, null, 2), [item.data]);

  // Render

  return (
    <Dialog title={item.description} showClose={true}>
      <pre className="whitespace-pre-wrap">{data}</pre>
    </Dialog>
  );
};
