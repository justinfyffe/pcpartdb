import {
  formatProductName,
  getGpuChipset,
  getProductBenchmarkShortName,
  ProductType,
} from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import { usePreferredBenchmark } from 'packages/website/src/client/user/hooks/usePreferredBenchmark';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContextProvider';

export const PerformanceIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetName1} and {props.chipsetName2}&apos;s performance
      with similar GPUs. This provides insight into how their benchmarks compare
      to their peers. This data is based on {props.preferredBenchmarkName}{' '}
      performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const preferredBenchmark = usePreferredBenchmark(ProductType.Gpu);
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = useMemo(
    () => formatProductName(chipset1, { company: false }),
    [chipset1],
  );
  const chipsetName2 = useMemo(
    () => formatProductName(chipset2, { company: false }),
    [chipset2],
  );

  const context = useMemo(() => {
    const preferredBenchmarkName =
      getProductBenchmarkShortName(preferredBenchmark);
    return { params: { chipsetName1, chipsetName2, preferredBenchmarkName } };
  }, [chipsetName1, chipsetName2, preferredBenchmark]);

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
