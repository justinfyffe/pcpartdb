import { getGpuName } from '@client/part';
import { compileContent, ContentContext } from '@client/shared/content';
import React, { useContext } from 'react';
import { ComparePageContext } from '../../../context';

export const CompatibilityIntroSentence1 = compileContent({
  deps: ['partName1', 'partName2'],
  component: (props) => (
    <>
      {props.partName1} and {props.partName2}&apos;s dimensions, bus interface,
      power consumption, and output ports. These specs are useful for verifying
      that these GPUs fit within your case and is compatible with your
      motherboard, power supply, and monitor.
    </>
  ),
});

export const CompatibilityIntro = () => {
  const { comparison } = useContext(ComparePageContext);
  const [part1, part2] = comparison;

  const params = {
    partName1: getGpuName(part1),
    partName2: getGpuName(part2),
  };

  return (
    <ContentContext.Provider value={{ params }}>
      <p className="text-content-dimmed">
        <CompatibilityIntroSentence1 />
      </p>
    </ContentContext.Provider>
  );
};
