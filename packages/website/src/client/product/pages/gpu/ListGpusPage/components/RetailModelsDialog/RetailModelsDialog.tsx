import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatGpuName, Gpu } from '@pcpartdb/shared';
import { gpuService } from 'packages/website/src/client/product/services';
import {
  Button,
  ButtonVariant,
  closeDialog,
  Spinner,
} from 'packages/website/src/client/shared/components';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { RetailModelsTable } from './RetailModelsTable';

interface RetailModelsDialogProps {
  chipset: Gpu;
}

export const RetailModelsDialog: FunctionComponent<RetailModelsDialogProps> = (
  props,
) => {
  const { chipset } = props;

  const chipsetId = chipset.id;
  const [retailModels, setRetailModels] = useState<Gpu[]>([]);
  const [loading, setLoading] = useState(false);

  const chipsetName = useMemo(
    () => formatGpuName(chipset, { company: false }),
    [chipset],
  );

  useEffect(() => {
    async function fetchRetailModels() {
      setLoading(true);
      const { retailModels } = await gpuService.listRetailModels(chipsetId);
      setRetailModels(retailModels);
      setLoading(false);
    }

    fetchRetailModels();
  }, [chipsetId]);

  return (
    <div className="bg-white flex flex-col gap-4 h-[80%] max-w-[80%] md:h-[90%] md:w-[90%] p-4 overflow-auto rounded shadow">
      <div className="flex justify-between items-center gap-2">
        <h3 className="mb-0">
          {retailModels.length} {chipsetName} cards
        </h3>
        <Button variant={ButtonVariant.None} onClick={() => closeDialog()}>
          <XMarkIcon className="w-8" />
        </Button>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center h-full w-full gap-6">
          <Spinner className="w-24 h-24 border-3" />
        </div>
      )}
      {!loading && <RetailModelsTable retailModels={retailModels} />}
    </div>
  );
};
