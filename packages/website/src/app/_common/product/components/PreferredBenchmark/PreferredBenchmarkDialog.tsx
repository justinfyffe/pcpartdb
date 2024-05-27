'use client';

import {
  BenchmarkKey,
  getPreferenceBenchmarks,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import { Dialog } from 'packages/website/src/client/shared/components/Dialog/Dialog';
import React, { FunctionComponent, useCallback, useState } from 'react';
import { GenericButton } from '../../../components/Button/GenericButton';
import { classNames } from '../../../utils/classNames';

interface PreferredBenchmarkDialogProps {
  productType: ProductType;
  onSelection: (benchmark: BenchmarkKey) => void;
}

export const PreferredBenchmarkDialog: FunctionComponent<
  PreferredBenchmarkDialogProps
> = (props) => {
  const { productType, onSelection } = props;

  const preferredBenchmarkOptions = getPreferenceBenchmarks(productType);
  const [selecting, setSelecting] = useState<BenchmarkKey>(null);

  const handleSelection = useCallback(
    async (benchmark: BenchmarkKey) => {
      try {
        setSelecting(benchmark);
        await onSelection(benchmark);
      } finally {
        setSelecting(null);
      }
    },
    [onSelection],
  );

  return (
    <Dialog title={'Choose your preferred benchmark'} showClose={true}>
      <div className="flex flex-col gap-2">
        {preferredBenchmarkOptions.map((benchmark) => (
          <GenericButton
            key={benchmark}
            disabled={selecting != null && benchmark !== selecting}
            onClick={() => handleSelection(benchmark)}
            className={classNames(
              selecting === benchmark ? 'animate-pulse bg-loading' : '',
            )}
          >
            {getProductBenchmarkName(benchmark)}
          </GenericButton>
        ))}
      </div>
    </Dialog>
  );
};
