import { Gpu } from '@pcpartdb/shared';
import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  ButtonVariant,
  closeDialog,
} from '../../../../../shared/components';
import { FormattedDataTab } from './formatted-data-tab';
import { RawDataTab } from './raw-data-tab';

enum Tab {
  Formatted,
  Raw,
}

interface PreviewDialogProps {
  gpu: Gpu;
}

export const PreviewDialog: FunctionComponent<PreviewDialogProps> = (props) => {
  const { gpu } = props;
  const [tab, setTab] = useState(Tab.Formatted);

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <div className="flex gap-4">
        <Button
          className="flex-1"
          variant={
            tab === Tab.Formatted
              ? ButtonVariant.Primary
              : ButtonVariant.Default
          }
          onClick={() => setTab(Tab.Formatted)}
        >
          Formatted
        </Button>
        <Button
          className="flex-1"
          variant={
            tab === Tab.Raw ? ButtonVariant.Primary : ButtonVariant.Default
          }
          onClick={() => setTab(Tab.Raw)}
        >
          Raw
        </Button>
      </div>

      {tab === Tab.Formatted ? <FormattedDataTab gpu={gpu} /> : <></>}
      {tab === Tab.Raw ? <RawDataTab gpu={gpu} /> : <></>}

      <div className="flex justify-end">
        <Button variant={ButtonVariant.Default} onClick={() => closeDialog()}>
          Close
        </Button>
      </div>
    </div>
  );
};
