import {
  getGpuChipset,
  getListGpusPath,
  ListGpusPresetSlug,
  productBenchmarkValuePerMsrp,
  ProductType,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';
import { ValueIntro } from './ValueIntro';
import { ValueTable } from './ValueTable';

export const RelativeValue: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const { comparison, relativeValueGpus } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;

  const chipset1 = useMemo(() => getGpuChipset(gpu1), [gpu1]);
  const chipset2 = useMemo(() => getGpuChipset(gpu2), [gpu2]);

  const listHref = useMemo(
    () => getListGpusPath(ListGpusPresetSlug.BestValue),
    [],
  );

  if (
    !productBenchmarkValuePerMsrp(chipset1, preferredBenchmark) &&
    !productBenchmarkValuePerMsrp(chipset2, preferredBenchmark)
  ) {
    return <></>;
  }

  if (!relativeValueGpus?.length) {
    return <></>;
  }

  return (
    <section>
      <h3 className="mb-1 font-semibold">Relative Value</h3>
      <ValueIntro />
      <ValueTable />
      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all GPUs by performance per dollar
        </Button>
      </div>
    </section>
  );
};
