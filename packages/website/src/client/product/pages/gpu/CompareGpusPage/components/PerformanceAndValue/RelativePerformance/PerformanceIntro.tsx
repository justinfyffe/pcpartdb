import { formatProductName, getGpuChipset } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../../context/ComparePageContext';

export const PerformanceIntroSentence1 = compileContentComponent({
  component: (props) => (
    <>
      Compare {props.chipsetName1} and {props.chipsetName2}&apos;s performance
      with similar GPUs. Relative performance provides insight into how their
      benchmarks compare to their peers. This data is based on chipset
      performance.
    </>
  ),
});

export const PerformanceIntro = () => {
  const { comparison } = useContext(ComparePageContext);
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

  const context = useMemo(
    () => ({ params: { chipsetName1, chipsetName2 } }),
    [chipsetName1, chipsetName2],
  );

  return (
    <ContentContext.Provider value={context}>
      <p className="text-dimmed">
        <PerformanceIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
