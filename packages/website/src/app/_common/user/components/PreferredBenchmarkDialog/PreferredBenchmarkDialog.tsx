import {
  BenchmarkKey,
  getPreferenceBenchmarks,
  getProductBenchmarkName,
  ProductType,
} from '@pcpartdb/shared';
import { Dialog } from 'packages/website/src/client/shared/components/Dialog/Dialog';
import React, { FunctionComponent, useCallback } from 'react';
import { GenericButton } from '../../../components/Button/GenericButton';

interface PreferredBenchmarkDialogProps {
  productType: ProductType;
  selected: BenchmarkKey;
  onSelection: (benchmark: BenchmarkKey) => void;
}

export const PreferredBenchmarkDialog: FunctionComponent<
  PreferredBenchmarkDialogProps
> = (props) => {
  const { productType, selected, onSelection } = props;

  const preferredBenchmarkOptions = getPreferenceBenchmarks(productType);

  const handleSelection = useCallback(
    async (benchmark: BenchmarkKey) => {
      await onSelection(benchmark);
    },
    [onSelection],
  );

  return (
    <Dialog title={'Choose your preferred benchmark'} showClose={true}>
      <div className="flex flex-col gap-2">
        {preferredBenchmarkOptions.map((benchmark) => (
          <GenericButton
            key={benchmark}
            disabled={benchmark === selected}
            onClick={() => handleSelection(benchmark)}
          >
            {getProductBenchmarkName(benchmark)}
          </GenericButton>
        ))}
      </div>
    </Dialog>
  );
};
