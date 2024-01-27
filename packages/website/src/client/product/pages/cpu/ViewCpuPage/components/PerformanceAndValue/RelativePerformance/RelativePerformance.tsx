import {
  getListCpusPath,
  ListCpusPresetSlug,
  productBenchmarkValue,
  ProductType,
} from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
} from 'packages/website/src/client/shared/components/Button/Button';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { FunctionComponent, useContext, useMemo } from 'react';
import { ViewPageContext } from '../../../context/ViewPageContextProvider';
import { PerformanceIntro } from './PerformanceIntro';
import { PerformanceTable } from './PerformanceTable';

export const RelativePerformance: FunctionComponent = () => {
  const preferredBenchmark = usePreferredBenchmark(ProductType.Cpu);
  const { cpu, relativePerformanceCpus } = useContext(ViewPageContext);

  const listHref = useMemo(
    () => getListCpusPath(ListCpusPresetSlug.BestPerformance),
    [],
  );

  if (
    !productBenchmarkValue(cpu, preferredBenchmark) ||
    !relativePerformanceCpus?.length
  ) {
    return <></>;
  }

  return (
    <section className="flex-1">
      <h3 className="mb-1 font-semibold">Relative Performance</h3>
      <PerformanceIntro />
      <PerformanceTable />
      <div className="text-right mt-2">
        <Button href={listHref} variant={ButtonVariant.Link}>
          View all CPUs by performance
        </Button>
      </div>
    </section>
  );
};
