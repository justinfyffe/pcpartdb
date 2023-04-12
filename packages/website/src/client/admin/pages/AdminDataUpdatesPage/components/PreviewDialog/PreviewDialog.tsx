import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent } from 'react';
import {
  Button,
  ButtonVariant,
  closeDialog,
} from '../../../../../shared/components';
import { RawDiffTab } from './RawDiffTab';

interface PreviewDialogProps {
  dataUpdate: DataUpdate;
}

export const PreviewDialog: FunctionComponent<PreviewDialogProps> = (props) => {
  const { dataUpdate } = props;

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <RawDiffTab dataUpdate={dataUpdate} />

      <div className="flex justify-end">
        <Button variant={ButtonVariant.Default} onClick={() => closeDialog()}>
          Close
        </Button>
      </div>
    </div>
  );
};
