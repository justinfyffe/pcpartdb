'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  formatProductName,
  GpuProduct,
  ListGpusFilter,
  ProductType,
} from '@pcpartdb/shared';
import { Button } from 'packages/website/src/app/_common/components/Button/Button';
import { ButtonVariant } from 'packages/website/src/app/_common/components/Button/types';
import { closeDialog } from 'packages/website/src/app/_common/components/Dialog/dialog';
import { Spinner } from 'packages/website/src/app/_common/components/Spinner/Spinner';
import { listProducts } from 'packages/website/src/app/_common/product/api';
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { RetailModelsTable } from './RetailModelsTable';

interface RetailModelsDialogProps {
  chipset: GpuProduct;
}

export const RetailModelsDialog: FunctionComponent<RetailModelsDialogProps> = (
  props,
) => {
  const { chipset } = props;

  const chipsetId = chipset.id;
  const [retailModels, setRetailModels] = useState<GpuProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const chipsetName = useMemo(
    () => formatProductName(chipset, { company: false }),
    [chipset],
  );

  useEffect(() => {
    async function fetchRetailModels() {
      setLoading(true);
      const { results } = await listProducts({
        filter: {
          productType: ProductType.Gpu,
          chipsetId: [chipsetId],
        } as ListGpusFilter,
      });
      setRetailModels(results as GpuProduct[]);
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
