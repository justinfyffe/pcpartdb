import { Gpu } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
  closeDialog,
} from 'packages/website/src/client/shared/components';
import React, { FunctionComponent } from 'react';
import { getGpuName } from '../../../../utils';
import { RetailModelsTable } from './RetailModelsTable';

interface RetailModelsDialogProps {
  gpu: Gpu;
}

export const RetailModelsDialog: FunctionComponent<RetailModelsDialogProps> = (
  props,
) => {
  const { gpu } = props;

  const retailModels = gpu.retailModels ?? [];

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] md:h-[90%] md:w-[90%] p-4 overflow-auto max-w-247 rounded shadow">
      <div className="flex justify-between items-center gap-2">
        <h3 className="mb-0">
          {retailModels.length} {getGpuName(gpu, { company: false })} cards
        </h3>
        <Button variant={ButtonVariant.Default} onClick={() => closeDialog()}>
          Close
        </Button>
      </div>
      <RetailModelsTable retailModels={retailModels} />
    </div>
  );
};
