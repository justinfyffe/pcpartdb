'use client';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { Dialog } from 'packages/website/src/app/_common/components/Dialog/Dialog';
import React, { FunctionComponent, useState } from 'react';
import { ListFilters } from './ListFilters';

interface ListFiltersDialogTriggerProps {
  className?: string;
}

export const ListFiltersDialogTrigger: FunctionComponent<
  ListFiltersDialogTriggerProps
> = (props) => {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => setDialogVisible(true)}
        className={props.className}
      >
        <AdjustmentsHorizontalIcon className="w-8" />
      </Button>

      <Dialog
        visible={dialogVisible}
        title="Filter GPUs"
        showClose
        onClose={() => setDialogVisible(false)}
      >
        <ListFilters />
      </Dialog>
    </>
  );
};
