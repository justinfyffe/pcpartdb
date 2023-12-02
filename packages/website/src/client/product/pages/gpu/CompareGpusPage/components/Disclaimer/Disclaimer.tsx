import { formatProductName, getGpuChipset } from '@pcpartdb/shared';
import { ContentContext } from 'packages/website/src/client/shared/content/ContentContext';
import { compileContentComponent } from 'packages/website/src/client/shared/content/utils';
import React, { useContext, useMemo } from 'react';
import { ComparePageContext } from '../../context/ComparePageContext';

const RatingDisclaimer = compileContentComponent({
  tags: [],
  component: (props) => (
    <p className="text-dimmed mb-0">
      *Performance rating, performance per dollar, and rankings are approximate
      values based on the {props.chipsetName1} and {props.chipsetName2}&apos;s
      benchmarks and MSRP.
    </p>
  ),
});

export const Disclaimer = () => {
  const { comparison } = useContext(ComparePageContext);
  const [gpu1, gpu2] = comparison;
  const [chipset1, chipset2] = [getGpuChipset(gpu1), getGpuChipset(gpu2)];

  const chipsetName1 = useMemo(() => formatProductName(chipset1), [chipset1]);
  const chipsetName2 = useMemo(() => formatProductName(chipset2), [chipset2]);

  const context = useMemo(
    () => ({ params: { chipsetName1, chipsetName2 } }),
    [chipsetName1, chipsetName2],
  );
  return (
    <ContentContext.Provider value={context}>
      <RatingDisclaimer />
    </ContentContext.Provider>
  );
};
